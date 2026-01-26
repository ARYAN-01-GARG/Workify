'use client';

import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { PostService } from '@/services/post.service';
import type { Comment, CreateCommentDto } from '@/types';

/**
 * Query key factory for comments
 */
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (postId: string) => [...commentKeys.lists(), postId] as const,
  replies: (commentId: string) => [...commentKeys.all, 'replies', commentId] as const,
};

/**
 * Fetch top-level comments for a post
 */
export function useComments(postId: string) {
  return useInfiniteQuery({
    queryKey: commentKeys.list(postId),
    queryFn: ({ pageParam = 1 }) => PostService.getComments(postId, { page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: !!postId,
  });
}

/**
 * Fetch replies for a comment
 */
export function useReplies(postId: string, commentId: string) {
  return useQuery({
    queryKey: commentKeys.replies(commentId),
    queryFn: () => PostService.getComments(postId, { page: 1, limit: 20, parentId: commentId }),
    enabled: !!commentId,
  });
}

/**
 * Create a new comment
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { postId: string; dto: CreateCommentDto }) =>
      PostService.addComment(data.postId, data.dto.content, data.dto.parentId),
    onSuccess: (_, variables) => {
      // If it's a reply, invalidate replies for that comment
      if (variables.dto.parentId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.replies(variables.dto.parentId) });
      } else {
        // If top-level, invalidate post comments
        queryClient.invalidateQueries({ queryKey: commentKeys.list(variables.postId) });
      }
      // Also invalidate post details to update comment count
      queryClient.invalidateQueries({ queryKey: ['posts', 'detail', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'list'] }); // Update list counts too
    },
  });
}

/**
 * Toggle like on a comment
 */
export function useToggleCommentLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => PostService.toggleCommentLike(commentId),
    // Optimistic updates are handled in the component for better UX
    onSuccess: () => {
      // Invalidate comments could be expensive, usually we just rely on local state
      // but strictly speaking we should revalidate
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
}

/**
 * Delete a comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => PostService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
      queryClient.invalidateQueries({ queryKey: ['posts'] }); // Update counts
    },
  });
}
