import { ApiClient } from '@/lib/api-client';
import type { Job, CreateJobDto, UpdateJobDto, JobQueryDto, PaginatedResponse } from '@/types/job';

export class JobService {
  static async getAll(params?: JobQueryDto): Promise<PaginatedResponse<Job>> {
    return ApiClient.get<PaginatedResponse<Job>>('/jobs', params as Record<string, unknown>);
  }

  static async getById(id: string): Promise<Job> {
    return ApiClient.get<Job>(`/jobs/${id}`);
  }

  static async create(data: CreateJobDto): Promise<Job> {
    return ApiClient.post<Job>('/jobs', data);
  }

  static async update(id: string, data: UpdateJobDto): Promise<Job> {
    return ApiClient.patch<Job>(`/jobs/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    return ApiClient.delete(`/jobs/${id}`);
  }

  static async apply(id: string): Promise<void> {
    return ApiClient.post(`/jobs/${id}/apply`, {});
  }
}
