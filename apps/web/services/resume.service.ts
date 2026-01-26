import { ApiClient } from '@/lib/api-client';

export interface Resume {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export class ResumeService {
  /**
   * Get my resumes
   */
  static async getMyResumes(): Promise<Resume[]> {
    return ApiClient.get<Resume[]>('/resumes');
  }

  /**
   * Upload a resume
   */
  static async uploadResume(file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append('file', file);

    // ApiClient needs support for FormData or we use raw fetch/axios
    // Assuming ApiClient can handle it or we use a custom request
    return ApiClient.post<Resume>('/resumes', formData);
  }

  /**
   * Delete a resume
   */
  static async deleteResume(id: string): Promise<void> {
    return ApiClient.delete(`/resumes/${id}`);
  }
}
