import { Job } from './job';
import { InterviewStatus, InterviewResult, InterviewRoundType } from './interview';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  SHORTLISTED = 'SHORTLISTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  user: User;
  // Add other candidate fields as needed
}

export interface Interview {
  id: string;
  applicationId: string;
  roundNumber: number;
  roundType: InterviewRoundType;
  assignedTo: string;
  assignedToUser: {
    name: string;
    avatarUrl?: string;
  };
  status: InterviewStatus;
  result: InterviewResult;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  feedback?: string;
  rating?: number;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  candidateProfileId: string;
  candidateProfile: CandidateProfile;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeId?: string;
  interviews: Interview[];
  appliedAt: string;
  updatedAt: string;
}
