import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../common/config';
import { randomUUID } from 'crypto';

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.region = config.s3.region;
    this.bucketName = config.s3.bucketName;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
    });
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'video/mp4',
      'video/quicktime',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
    }

    const fileExtension = file.originalname.split('.').pop() || '';
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    const key = `${folder}/${uniqueFilename}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      this.logger.log(`File uploaded successfully: ${key}`);

      return {
        url,
        key,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error}`);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  /**
   * Upload multiple files to S3
   */
  async uploadMultipleFiles(files: Express.Multer.File[], folder: string = 'uploads'): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const file of files) {
      const result = await this.uploadFile(file, folder);
      results.push(result);
    }

    return results;
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error}`);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  /**
   * Extract key from S3 URL
   */
  extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      // Remove leading slash
      return urlObj.pathname.substring(1);
    } catch {
      return null;
    }
  }
}
