import { ApiClient } from '@/lib/api-client';
import type { UserProfile, UpdateCandidateProfileDto, UpdateRecruiterProfileDto } from '@/types';

/**
 * User service - handles all user-related API calls
 * Always use this service instead of calling ApiClient directly in components
 */
export const UserService = {
  /**
   * Get current authenticated user's profile
   */
  async getProfile(): Promise<UserProfile> {
    return ApiClient.get<UserProfile>('/user/profile');
  },

  /**
   * Get a user's public profile by ID
   */
  async getPublicProfile(id: string): Promise<UserProfile> {
    return ApiClient.get<UserProfile>(`/user/${id}`);
  },

  /**
   * Update candidate profile (for candidates only)
   */
  async updateCandidateProfile(data: UpdateCandidateProfileDto): Promise<UserProfile> {
    return ApiClient.patch<UserProfile>('/user/profile/candidate', data);
  },

  /**
   * Update recruiter profile (for recruiters only)
   */
  async updateRecruiterProfile(data: UpdateRecruiterProfileDto): Promise<UserProfile> {
    return ApiClient.patch<UserProfile>('/user/profile/recruiter', data);
  },

  /**
   * Update user avatar/profile picture
   */
  async updateAvatar(avatarUrl: string): Promise<{ avatarUrl: string }> {
    return ApiClient.patch<{ avatarUrl: string }>('/user/profile/avatar', { avatarUrl });
  },

  /**
   * Update user cover/banner image
   */
  async updateCover(coverUrl: string): Promise<{ coverUrl: string }> {
    return ApiClient.patch<{ coverUrl: string }>('/user/profile/cover', { coverUrl });
  },
};
