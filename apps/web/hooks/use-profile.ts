'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/user.service';
import type { UserProfile, UpdateCandidateProfileDto, UpdateRecruiterProfileDto } from '@/types';

// Re-export types for backwards compatibility
export type { UserProfile, Education, Experience, CandidateProfile, RecruiterProfile } from '@/types';

/**
 * Query key factory for user/profile queries
 */
export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  user: (id: string) => [...profileKeys.all, id] as const,
};

/**
 * Fetch current authenticated user's profile
 */
export function useCurrentUserProfile() {
  return useQuery<UserProfile>({
    queryKey: profileKeys.me(),
    queryFn: () => UserService.getProfile(),
  });
}

/**
 * Fetch a user's public profile by ID
 */
export function useUserProfile(userId: string) {
  return useQuery<UserProfile>({
    queryKey: profileKeys.user(userId),
    queryFn: () => UserService.getPublicProfile(userId),
    enabled: !!userId,
  });
}

/**
 * Update candidate profile
 */
export function useUpdateCandidateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCandidateProfileDto) => UserService.updateCandidateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

/**
 * Update recruiter profile
 */
export function useUpdateRecruiterProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRecruiterProfileDto) => UserService.updateRecruiterProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
