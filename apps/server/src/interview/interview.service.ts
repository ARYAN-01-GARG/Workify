import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { UserRole } from '@repo/db';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateInterviewDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: { job: true },
    });

    if (!application) throw new NotFoundException('Application not found');

    if (application.job.postedById !== userId) {
      throw new ForbiddenException('Only job owner can schedule interviews');
    }

    const roundConfig = await this.prisma.interviewRoundConfig.findUnique({
      where: {
        jobId_roundNumber: { jobId: application.jobId, roundNumber: dto.roundNumber },
      },
    });

    if (!roundConfig) {
      throw new BadRequestException('Round not configured for this job');
    }

    const existing = await this.prisma.interview.findUnique({
      where: {
        applicationId_roundNumber: {
          applicationId: dto.applicationId,
          roundNumber: dto.roundNumber,
        },
      },
    });

    if (existing) throw new ConflictException('Interview already exists for this round');

    // Verify assigned user exists
    const assignedUser = await this.prisma.user.findUnique({ where: { id: dto.assignedTo } });
    if (!assignedUser) throw new NotFoundException('Assigned user not found');

    return this.prisma.interview.create({
      data: {
        applicationId: dto.applicationId,
        roundNumber: dto.roundNumber,
        roundType: roundConfig.roundType,
        assignedTo: dto.assignedTo,
        assignedBy: userId,
        scheduledAt: dto.scheduledAt,
      },
    });
  }

  async findOne(userId: string, id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            job: true,
            candidateProfile: true,
          },
        },
        assignedToUser: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    if (!interview) throw new NotFoundException('Interview not found');

    const jobOwnerId = interview.application.job.postedById;
    const candidateUserId = interview.application.candidateProfile.userId;

    if (userId !== jobOwnerId && userId !== interview.assignedTo && userId !== candidateUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Unauthorized');
      }
    }

    return interview;
  }

  async update(userId: string, id: string, dto: UpdateInterviewDto) {
    const interview = await this.findOne(userId, id);

    // Update Access: Job Owner, Assigned Reviewer, Admin
    // Candidate cannot update
    const jobOwnerId = interview.application.job.postedById;

    if (userId !== jobOwnerId && userId !== interview.assignedTo) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('You are not authorized to update this interview');
      }
    }

    if (dto.feedback && interview.feedback) {
      throw new BadRequestException('Feedback already submitted');
    }

    return this.prisma.interview.update({
      where: { id },
      data: dto,
    });
  }

  async getByApplication(userId: string, applicationId: string) {
    // Check permission
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true, candidateProfile: true },
    });
    if (!application) throw new NotFoundException('Application not found');

    const jobOwnerId = application.job.postedById;
    const candidateUserId = application.candidateProfile.userId;

    if (userId !== jobOwnerId && userId !== candidateUserId) {
      // Assigned reviewers also?
      // For now restrict to owner/candidate/admin
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== UserRole.ADMIN) {
        // If user is assigned to ANY interview in this app, they can see?
        // Simplification: strict owner check for list.
        throw new ForbiddenException('Unauthorized');
      }
    }

    return this.prisma.interview.findMany({
      where: { applicationId },
      orderBy: { roundNumber: 'asc' },
      include: { assignedToUser: { select: { name: true, avatarUrl: true } } },
    });
  }
}
