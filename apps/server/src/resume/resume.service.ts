import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
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
    this.logger.log({ userId }, 'Uploading resume');

    // Validate file type (PDF only for now, or match UploadService allowed types)
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) {
      throw new BadRequestException('Candidate profile not found');
    }

    // Upload to S3
    const uploadResult = await this.uploadService.uploadFile(file, 'resumes');

    // Create DB Record
    return this.prisma.resume.create({
      data: {
        name: file.originalname,
        url: uploadResult.url,
        key: uploadResult.key,
        size: uploadResult.size,
        candidateProfileId: candidateProfile.id,
      },
    });
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
