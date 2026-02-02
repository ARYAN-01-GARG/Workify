import { ApiClient } from '@/lib/api-client';
import { InterviewRoundType } from '@/types/interview';

export interface InterviewRoundConfig {
  id: string;
  jobId: string;
  roundNumber: number;
  roundType: InterviewRoundType;
  isRequired: boolean;
  createdAt: string;
}

export interface CreateRoundConfigDto {
  roundType: InterviewRoundType;
  roundNumber: number;
  isRequired?: boolean;
}

export class InterviewRoundService {
  static async getAll(jobId: string): Promise<InterviewRoundConfig[]> {
    return ApiClient.get<InterviewRoundConfig[]>(`/jobs/${jobId}/rounds`);
  }

  static async create(jobId: string, data: CreateRoundConfigDto): Promise<InterviewRoundConfig> {
    return ApiClient.post<InterviewRoundConfig>(`/jobs/${jobId}/rounds`, data);
  }

  static async delete(jobId: string, roundNumber: number): Promise<void> {
    return ApiClient.delete(`/jobs/${jobId}/rounds/${roundNumber}`);
  }
}
