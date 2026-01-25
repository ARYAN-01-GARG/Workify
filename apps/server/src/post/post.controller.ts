import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostSearchDto } from './dto/post-search.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@repo/shared-types';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  create(@Req() req: RequestWithUser, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user.id, createPostDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get posts feed' })
  findAll(@Req() req: RequestWithUser, @Query() query: PostSearchDto) {
    return this.postService.findAll(query, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific post' })
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.postService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  update(@Req() req: RequestWithUser, @Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(req.user.id, id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.postService.remove(req.user.id, id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like on a post' })
  toggleLike(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.postService.toggleLike(req.user.id, id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a post' })
  addComment(@Req() req: RequestWithUser, @Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
    return this.postService.addComment(req.user.id, id, createCommentDto);
  }

  @Get(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiQuery({ name: 'parentId', required: false })
  getComments(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('parentId') parentId?: string
  ) {
    return this.postService.getComments(req.user.id, id, +page, +limit, parentId);
  }
}

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly postService: PostService) {}

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like on a comment' })
  toggleLike(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.postService.toggleCommentLike(req.user.id, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.postService.removeComment(req.user.id, id);
  }
}
