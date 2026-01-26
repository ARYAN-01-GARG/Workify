'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PostService } from '@/services/post.service';
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
 * Query key factory for posts - ensures consistent cache keys
 */
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: PostQueryParams) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  comments: (postId: string) => [...postKeys.all, 'comments', postId] as const,
};

/**
 * Fetch posts feed with optional filters
 */
export function usePosts(params?: PostQueryParams) {
  return useQuery<PostsResponse>({
    queryKey: postKeys.list(params ?? {}),
    queryFn: () => PostService.findAll(params),
  });
}

/**
 * Fetch a single post by ID
 */
export function usePost(id: string) {
  return useQuery<Post>({
    queryKey: postKeys.detail(id),
    queryFn: () => PostService.findOne(id),
    enabled: !!id,
  });
}

/**
 * Create a new post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => PostService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Update an existing post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostDto }) => PostService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Delete a post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PostService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Toggle like on a post (optimistic update handled in component)
 */
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PostService.toggleLike(id),
    onSuccess: () => {
      // Invalidate to refresh like counts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Fetch comments for a post
 */
export function usePostComments(postId: string, params?: Omit<CommentQueryParams, 'page' | 'limit'>) {
  return useQuery<CommentsResponse>({
    queryKey: postKeys.comments(postId),
    queryFn: () => PostService.getComments(postId, { page: 1, limit: 10, ...params }),
    enabled: !!postId,
  });
}

/**
 * Add a comment to a post
 */
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content, parentId }: { postId: string; content: string; parentId?: string }) =>
      PostService.addComment(postId, content, parentId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
