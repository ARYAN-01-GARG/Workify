import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PostService, CreatePostDto, PostSearchDto } from '@/services/post.service';
import { Post } from '@/components/feed/post-card';

export function usePosts(params?: PostSearchDto) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => PostService.findAll(params),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => PostService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PostService.toggleLike(id),
    onSuccess: (_, id) => {
      // We could invalidate specific post or all posts
      // Invalidate all posts to refresh like counts in feed
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
