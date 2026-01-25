import { ApiClient } from '@/lib/api-client';
import type {
  Post,
  PostsResponse,
  CreatePostDto,
  UpdatePostDto,
  Comment,
  CommentsResponse,
  PostQueryParams,
  CommentQueryParams,
} from '@/types';

/**
 * Post service - handles all post-related API calls
 * Always use this service instead of calling ApiClient directly in components
 */
export const PostService = {
  /**
   * Create a new post
   */
  async create(data: CreatePostDto): Promise<Post> {
    return ApiClient.post<Post>('/posts', data);
  },

  /**
   * Get paginated posts feed
   */
  async findAll(params?: PostQueryParams): Promise<PostsResponse> {
    return ApiClient.get<PostsResponse>('/posts', params as Record<string, unknown>);
  },

  /**
   * Get a single post by ID
   */
  async findOne(id: string): Promise<Post> {
    return ApiClient.get<Post>(`/posts/${id}`);
  },

  /**
   * Update a post
   */
  async update(id: string, data: UpdatePostDto): Promise<Post> {
    return ApiClient.patch<Post>(`/posts/${id}`, data);
  },

  /**
   * Delete a post
   */
  async delete(id: string): Promise<void> {
    return ApiClient.delete(`/posts/${id}`);
  },

  /**
   * Toggle like on a post (like/unlike)
   */
  async toggleLike(id: string): Promise<{ liked: boolean }> {
    return ApiClient.post<{ liked: boolean }>(`/posts/${id}/like`);
  },

  /**
   * Add a comment to a post
   */
  async addComment(postId: string, content: string, parentId?: string): Promise<Comment> {
    return ApiClient.post<Comment>(`/posts/${postId}/comments`, { content, parentId });
  },

  /**
   * Get comments for a post with pagination
   */
  async getComments(postId: string, params: CommentQueryParams): Promise<CommentsResponse> {
    return ApiClient.get<CommentsResponse>(`/posts/${postId}/comments`, params as unknown as Record<string, unknown>);
  },
};
