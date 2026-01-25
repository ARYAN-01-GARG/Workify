import { ApiClient } from '@/lib/api-client';
import { Post } from '@/components/feed/post-card';

export interface CreatePostDto {
  content: string;
  mediaUrls?: string[];
  tags?: string[];
}

export interface PostSearchDto {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
}

export const PostService = {
  async create(data: CreatePostDto) {
    return ApiClient.post('/posts', data);
  },

  async findAll(params?: PostSearchDto) {
    // ApiClient.get returns the data T.
    // Assuming backend returns Post[] or { data: Post[], meta: ... }
    // The previous code expected response.data but ApiClient already unpacks it.
    // Let's assume ApiClient returns the body directly.
    return ApiClient.get('/posts', params as Record<string, unknown>);
  },

  async findOne(id: string) {
    return ApiClient.get(`/posts/${id}`);
  },

  async toggleLike(id: string) {
    return ApiClient.post(`/posts/${id}/like`);
  },

  async addComment(id: string, content: string) {
    return ApiClient.post(`/posts/${id}/comments`, { content });
  },

  async getComments(id: string, page = 1) {
    return ApiClient.get(`/posts/${id}/comments`, { page });
  },

  async delete(id: string) {
    return ApiClient.delete(`/posts/${id}`);
  },
};
