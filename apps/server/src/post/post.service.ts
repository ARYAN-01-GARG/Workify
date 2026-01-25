import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostSearchDto } from './dto/post-search.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Prisma, UserRole } from '@repo/db';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PostService {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    this.logger.log({ userId, dto: createPostDto }, 'Creating new post');
    const { tags, ...postData } = createPostDto;

    // Process tags: create if not exist
    const tagConnect =
      tags?.map((tag) => ({
        where: { name: tag },
        create: { name: tag },
      })) || [];

    return this.prisma.post.create({
      data: {
        ...postData,
        authorId: userId,
        tags: {
          connectOrCreate: tagConnect,
        },
      },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
        tags: true,
      },
    });
  }

  async findAll(query: PostSearchDto, userId?: string) {
    this.logger.debug({ query, userId }, 'Fetching posts feed');
    const { query: searchQuery, tag, limit = 10, cursor, type } = query;

    const where: Prisma.PostWhereInput = {
      deletedAt: null, // Soft Delete check
    };

    if (searchQuery) {
      where.AND = [
        {
          OR: [{ content: { contains: searchQuery, mode: 'insensitive' } }],
        },
      ];
    }

    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      };
    }

    // Following Feed Logic
    if (type === 'FOLLOWING' && userId) {
      const connections = await this.prisma.connection.findMany({
        where: {
          OR: [
            { senderId: userId, status: 'ACCEPTED' },
            { receiverId: userId, status: 'ACCEPTED' },
          ],
        },
      });

      const followingIds = connections.map((c) => (c.senderId === userId ? c.receiverId : c.senderId));
      // Include self posts too? Usually feed includes self.
      followingIds.push(userId);

      where.authorId = { in: followingIds };
    }

    // Cursor Pagination
    const posts = await this.prisma.post.findMany({
      where,
      take: limit + 1, // Fetch one extra to determine next cursor
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // Skip the cursor itself if present
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
        tags: true,
        _count: {
          select: { likes: true, comments: true },
        },
        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const hasNextPage = posts.length > limit;
    const data = hasNextPage ? posts.slice(0, -1) : posts;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    // Enhance posts with likedByCurrentUser flag
    const enhancedData = data.map((post) => ({
      ...post,
      likedByCurrentUser: userId ? post.likes.length > 0 : false,
      likes: undefined,
    }));

    return {
      data: enhancedData,
      meta: {
        nextCursor,
        limit,
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
        tags: true,
        _count: {
          select: { likes: true, comments: true },
        },
        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    return {
      ...post,
      likedByCurrentUser: userId ? post.likes.length > 0 : false,
      likes: undefined,
    };
  }

  async update(userId: string, id: string, updatePostDto: UpdatePostDto) {
    this.logger.log({ userId, postId: id, dto: updatePostDto }, 'Updating post');
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('You can only update your own posts');

    const { tags, ...data } = updatePostDto;

    // Prepare update data
    const updateData: Prisma.PostUpdateInput = { ...data };

    if (tags) {
      updateData.tags = {
        set: [], // Clear existing
        connectOrCreate: tags.map((t) => ({ where: { name: t }, create: { name: t } })),
      };
    }

    return this.prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        tags: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    this.logger.warn({ userId, postId: id }, 'Deleting post');
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    // Allow admin to delete? Assuming yes for safety
    // Needs user check
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (post.authorId !== userId && user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async toggleLike(userId: string, postId: string) {
    this.logger.debug({ userId, postId }, 'Toggling post like');
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    // Check if like exists
    const existingLike = await this.prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      // Unlike
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      return { liked: false };
    } else {
      // Like
      await this.prisma.like.create({
        data: { userId, postId },
      });
      return { liked: true };
    }
  }

  async addComment(userId: string, postId: string, createCommentDto: CreateCommentDto) {
    this.logger.log({ userId, postId, dto: createCommentDto }, 'Adding comment');
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const { parentId, content } = createCommentDto;

    if (parentId) {
      const parent = await this.prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent) throw new NotFoundException('Parent comment not found');
      if (parent.postId !== postId) throw new BadRequestException('Parent comment belongs to a different post');
      // Limit nesting? "nested comments are allowed" - generic usually means infinite or until UI breaks.
    }

    return this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
        parentId,
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async getComments(userId: string, postId: string, page: number = 1, limit: number = 20, parentId?: string) {
    this.logger.debug({ userId, postId, page, parentId }, 'Fetching comments');
    const skip = (page - 1) * limit;
    const where: Prisma.CommentWhereInput = { postId, parentId: parentId || null };

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { replies: true, likes: true } },
          likes: userId ? { where: { userId }, select: { id: true } } : false,

          replies: !parentId
            ? {
                take: 3,
                include: {
                  author: { select: { id: true, name: true, avatarUrl: true } },
                  _count: { select: { likes: true } },
                },
              }
            : false,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.comment.count({ where }),
    ]);

    const data = comments.map((c) => ({
      ...c,
      likedByCurrentUser: userId ? c.likes.length > 0 : false,
      likes: undefined,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async toggleCommentLike(userId: string, commentId: string) {
    this.logger.debug({ userId, commentId }, 'Toggling comment like');
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    const existingLike = await this.prisma.like.findFirst({
      where: { userId, commentId },
    });

    if (existingLike) {
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      return { liked: false };
    } else {
      await this.prisma.like.create({
        data: { userId, commentId },
      });
      return { liked: true };
    }
  }

  async removeComment(userId: string, commentId: string) {
    this.logger.warn({ userId, commentId }, 'Removing comment');
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    let canDelete = comment.authorId === userId || user?.role === UserRole.ADMIN;

    if (!canDelete) {
      const post = await this.prisma.post.findUnique({ where: { id: comment.postId } });
      if (post && post.authorId === userId) {
        canDelete = true;
      }
    }

    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this comment');
    }

    return this.prisma.comment.delete({ where: { id: commentId } });
  }
}
