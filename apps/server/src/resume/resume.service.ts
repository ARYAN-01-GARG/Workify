import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ResumeService {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService
  ) {}

  async uploadResume(userId: string, file: Express.Multer.File) {
    this.logger.log({ userId, filename: file.originalname }, 'Uploading resume');

    // Validate file type (PDF only for now, or match UploadService allowed types)
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    // Validate file size (5MB limit for resumes)
    const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_RESUME_SIZE) {
      throw new BadRequestException('Resume file size must not exceed 5MB');
    }

    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) {
      throw new BadRequestException('Candidate profile not found');
    }

    // Upload to S3 with error handling
    let uploadResult;
    try {
      uploadResult = await this.uploadService.uploadFile(file, 'resumes');
    } catch (error) {
      this.logger.error({ error, userId }, 'Failed to upload resume to S3');
      throw new InternalServerErrorException('Failed to upload resume');
    }

    // Create DB Record with rollback on failure
    try {
      return await this.prisma.resume.create({
        data: {
          name: file.originalname,
          url: uploadResult.url,
          key: uploadResult.key,
          size: uploadResult.size,
          candidateProfileId: candidateProfile.id,
        },
      });
    } catch (error) {
      // Rollback: delete from S3 if DB creation fails
      this.logger.error({ error, userId }, 'Failed to save resume to database, rolling back S3 upload');
      await this.uploadService.deleteFile(uploadResult.key).catch((err) => {
        // Log cleanup failure but don't mask the primary error
        this.logger.error({ err, key: uploadResult.key }, 'Failed to cleanup S3 file after DB error');
      });
      // Always throw the original database error, regardless of cleanup success
      throw new InternalServerErrorException('Failed to save resume');
    }
  }

  async getMyResumes(userId: string) {
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) return [];

    return this.prisma.resume.findMany({
      where: { candidateProfileId: candidateProfile.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteResume(userId: string, resumeId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
      include: { candidateProfile: true },
    });

    if (!resume) throw new NotFoundException('Resume not found');

    if (resume.candidateProfile.userId !== userId) {
      throw new ForbiddenException('You do not own this resume');
    }

    // Delete from S3
    await this.uploadService.deleteFile(resume.key);

    // Delete from DB
    return this.prisma.resume.delete({
      where: { id: resumeId },
    });
  }
}
