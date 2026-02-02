import { ApiClient } from '@/lib/api-client';
import type { Job, CreateJobDto, UpdateJobDto, JobQueryDto, PaginatedResponse } from '@/types/job';
import type { Application, ApplicationStatus } from '@/types/application';

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

  static async apply(id: string, data: { coverLetter?: string; resumeId?: string }): Promise<void> {
    return ApiClient.post(`/jobs/${id}/apply`, data);
  }

  static async getMyAppliedJobs(): Promise<Job[]> {
    return ApiClient.get<Job[]>('/jobs/applied');
  }

  static async getApplicationStatus(jobId: string): Promise<{ id: string; status: string; appliedAt: string } | null> {
    return ApiClient.get<{ id: string; status: string; appliedAt: string } | null>(`/jobs/${jobId}/my-application`);
  }

  static async getApplication(jobId: string, applicationId: string): Promise<Application> {
    return ApiClient.get<Application>(`/jobs/${jobId}/applications/${applicationId}`);
  }

  static async updateApplicationStatus(jobId: string, applicationId: string, status: ApplicationStatus): Promise<void> {
    return ApiClient.patch(`/jobs/${jobId}/applications/${applicationId}`, { status });
  }

  static async getApplications(jobId: string, params?: any): Promise<PaginatedResponse<Application>> {
    return ApiClient.get<PaginatedResponse<Application>>(`/jobs/${jobId}/applications`, params);
  }
}
