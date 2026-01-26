export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'DIRECTOR' | 'EXECUTIVE';
export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  location?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skills: string[];
  type: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  companyId: string;
  company?: Company;
  postedById: string;
  postedBy?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    applications: number;
  };
}

export interface CreateJobDto {
  title: string;
  description: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills: string[];
  type?: JobType;
  workMode?: WorkMode;
  experienceLevel?: ExperienceLevel;
  status?: JobStatus;
}

export type UpdateJobDto = Partial<CreateJobDto>;

export interface JobQueryDto {
  page?: number;
  limit?: number;
  query?: string;
  location?: string;
  type?: JobType;
  workMode?: WorkMode;
  experienceLevel?: ExperienceLevel;
  skills?: string;
  datePosted?: 'ALL' | 'LAST_24_HOURS' | 'LAST_7_DAYS' | 'LAST_30_DAYS';
  sortBy?: 'newest' | 'salary';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
