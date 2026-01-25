/**
 * User and Profile types matching Swagger API spec
 */

/**
 * Education entry for candidate profile
 */
export interface Education {
  id?: string;
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  activities?: string;
  description?: string;
}

/**
 * Experience/Work history entry for candidate profile
 */
export interface Experience {
  id?: string;
  title: string;
  companyName: string;
  employmentType?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

/**
 * Company information
 */
export interface Company {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
}

/**
 * Candidate-specific profile data
 */
export interface CandidateProfile {
  id: string;
  headline?: string;
  skills?: string[];
  resumeUrl?: string;
  education: Education[];
  experience: Experience[];
}

/**
 * Recruiter-specific profile data
 */
export interface RecruiterProfile {
  id: string;
  company?: Company;
}

/**
 * User roles enum
 */
export type UserRole = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

/**
 * Full user profile
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  about?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  role: UserRole;
  createdAt: string;
  candidateProfile?: CandidateProfile;
  recruiterProfile?: RecruiterProfile;
  _count?: {
    posts: number;
    sentRequests: number;
    receivedRequests: number;
  };
}

/**
 * DTO for updating candidate profile
 */
export interface UpdateCandidateProfileDto {
  name?: string;
  bio?: string;
  about?: string;
  location?: string;
  website?: string;
  resumeUrl?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
}

/**
 * DTO for updating recruiter profile
 */
export interface UpdateRecruiterProfileDto {
  name?: string;
  bio?: string;
  about?: string;
  companyId?: string;
}
