import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JobType, WorkMode, ExperienceLevel, UserRole } from '@repo/db';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobSearchDto } from './dto/job-search.dto';
import { ApplicationQueryDto } from './dto/application-query.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@repo/db';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createJobDto: CreateJobDto) {
    // 1. Get Recruiter Profile to link Company
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiterProfile) {
      throw new ForbiddenException('You must have a recruiter profile to post jobs');
    }

    if (!recruiterProfile.companyId) {
      throw new ForbiddenException('Recruiter must be linked to a company');
    }

    return this.prisma.job.create({
      data: {
        ...createJobDto,
        postedById: userId,
        companyId: recruiterProfile.companyId,
      },
      include: {
        company: true,
      },
    });
  }

  async findAll(query: JobSearchDto) {
    const { query: searchQuery, location, type, workMode, experienceLevel } = query;

    const where: Prisma.JobWhereInput = {
      status: 'OPEN',
    };

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { company: { name: { contains: searchQuery, mode: 'insensitive' } } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (type) where.type = type;
    if (workMode) where.workMode = workMode;
    if (experienceLevel) where.experienceLevel = experienceLevel;

    return this.prisma.job.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        postedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(userId: string, id: string, updateJobDto: UpdateJobDto) {
    const job = await this.findOne(id);

    if (job.postedById !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('You can only update your own job postings');
      }
    }

    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
      include: {
        company: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    const job = await this.findOne(id);

    if (job.postedById !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('You can only delete your own job postings');
      }
    }

    return this.prisma.job.delete({
      where: { id },
    });
  }

  async apply(userId: string, jobId: string, coverLetter?: string) {
    // Check if job exists
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== 'OPEN') throw new BadRequestException('Job is no longer accepting applications');

    // Get Candidate Profile
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) {
      throw new ForbiddenException('You must have a candidate profile to apply');
    }

    // Check if already applied
    const existingApplication = await this.prisma.application.findUnique({
      where: {
        jobId_candidateProfileId: {
          jobId,
          candidateProfileId: candidateProfile.id,
        },
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied to this job');
    }

    return this.prisma.application.create({
      data: {
        jobId,
        candidateProfileId: candidateProfile.id,
        coverLetter,
      },
    });
  }

  async getApplications(userId: string, jobId: string, query: ApplicationQueryDto) {
    const job = await this.findOne(jobId);

    if (job.postedById !== userId) {
      throw new ForbiddenException('You can only view applications for your own jobs');
    }

    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { jobId },
        skip,
        take: limit,
        include: {
          candidateProfile: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: {
          appliedAt: 'desc',
        },
      }),
      this.prisma.application.count({ where: { jobId } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
