/**
 * Post-related types matching Swagger API spec
 */

import type { Author, CursorPaginatedResponse, PaginatedResponse } from './common';

/**
 * Post entity matching backend response
 */
export interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: Author & {
    headline?: string | null;
    role?: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  hasLiked?: boolean;
}

/**
 * Comment entity
 */
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  parentId?: string | null;
  _count: {
    likes: number;
    replies: number;
  };
  hasLiked?: boolean; // From backend: likedByCurrentUser
  likedByCurrentUser?: boolean; // Alias for hasLiked
  replies?: Comment[];
}

/**
 * DTO for creating a new post
 */
export interface CreatePostDto {
  content: string;
  mediaUrls?: string[];
  tags?: string[];
}

/**
 * DTO for updating a post
 */
export interface UpdatePostDto {
  content?: string;
  mediaUrls?: string[];
  tags?: string[];
}

/**
 * DTO for creating a comment
 */
export interface CreateCommentDto {
  content: string;
  parentId?: string;
}

/**
 * Query parameters for fetching posts
 */
export interface PostQueryParams {
  query?: string;
  tag?: string;
  type?: 'ALL' | 'FOLLOWING';
  authorId?: string;
  page?: number;
  limit?: number;
  cursor?: string;
}

/**
 * Query parameters for fetching comments
 */
export interface CommentQueryParams {
  page: number;
  limit: number;
  parentId?: string;
}

/**
 * Response type for posts list (cursor-based pagination)
 */
export type PostsResponse = CursorPaginatedResponse<Post>;

/**
 * Response type for comments list
 */
export interface CommentsResponse {
  data: Comment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
