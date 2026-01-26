import { ApiClient } from '@/lib/api-client';

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  mimetype: string;
  size: number;
}

/**
 * Upload service - handles file uploads to S3 via the backend
 */
export const UploadService = {
  /**
   * Upload a single file
   * @param file File to upload
   * @param folder Folder in S3 (default: 'uploads')
   */
  async uploadFile(file: File, folder: string = 'uploads'): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    return ApiClient.post<UploadResult>(`/upload?folder=${encodeURIComponent(folder)}`, formData);
  },

  /**
   * Upload multiple files (max 5)
   * @param files Files to upload
   * @param folder Folder in S3 (default: 'uploads')
   */
  async uploadMultipleFiles(files: File[], folder: string = 'uploads'): Promise<UploadResult[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return ApiClient.post<UploadResult[]>(`/upload/multiple?folder=${encodeURIComponent(folder)}`, formData);
  },
};
