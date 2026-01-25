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
  currentlyWorking?: boolean;
  description?: string;
}

export interface UpdateCandidateProfileDto {
  name?: string;
  bio?: string;
  about?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
}

export const UserService = {
  async updateCandidateProfile(data: UpdateCandidateProfileDto) {
    // Data now matches backend DTO format directly
    return ApiClient.patch('/user/profile/candidate', data);
  },

  async updateRecruiterProfile(data: any) {
    return ApiClient.patch('/user/profile/recruiter', data);
  },
};
