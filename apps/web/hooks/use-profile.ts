'use client';

import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';

export interface Education {
  id?: string;
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  id?: string;
  title: string;
  companyName: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  currentlyWorking?: boolean;
}

export interface CandidateProfile {
  id: string;
  headline?: string;
  skills?: string[];
  resumeUrl?: string;
  education: Education[];
  experience: Experience[];
}

export interface RecruiterProfile {
  id: string;
  company?: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  about?: string;
  avatarUrl?: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  createdAt: string;
  candidateProfile?: CandidateProfile;
  recruiterProfile?: RecruiterProfile;
  _count?: {
    posts: number;
    sentRequests: number;
    receivedRequests: number;
  };
}

export function useCurrentUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const response = await ApiClient.get<UserProfile>('/user/profile');
      return response;
    },
  });
}

export function useUserProfile(userId: string) {
  return useQuery<UserProfile>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const response = await ApiClient.get<UserProfile>(`/user/${userId}`);
      return response;
    },
    enabled: !!userId,
  });
}
