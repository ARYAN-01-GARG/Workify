import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JobType, WorkMode, ExperienceLevel, UserRole } from '@repo/db';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobSearchDto } from './dto/job-search.dto';
import { ApplicationQueryDto } from './dto/application-query.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@repo/db';

import { Logger } from 'nestjs-pino';

@Injectable()
export class JobService {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService
  ) {}

  async create(userId: string, createJobDto: CreateJobDto) {
    this.logger.log({ userId, jobTitle: createJobDto.title }, 'Creating new job');
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
    this.logger.debug({ query }, 'Searching jobs');
    const {
      query: searchQuery,
      location,
      type,
      workMode,
      experienceLevel,
      skills,
      datePosted,
      sortBy,
      page = 1,
      limit = 20,
    } = query;
    const skip = (page - 1) * limit;

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

    if (skills) {
      const skillsList = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (skillsList.length > 0) {
        where.skills = { hasSome: skillsList };
      }
    }

    if (datePosted && datePosted !== 'ALL') {
      const now = new Date();
      const dateFrom = new Date();

      switch (datePosted) {
        case 'LAST_24_HOURS':
          dateFrom.setDate(now.getDate() - 1);
          break;
        case 'LAST_7_DAYS':
          dateFrom.setDate(now.getDate() - 7);
          break;
        case 'LAST_30_DAYS':
          dateFrom.setDate(now.getDate() - 30);
          break;
      }

      where.createdAt = { gte: dateFrom };
    }

    if (type) where.type = type;
    if (workMode) where.workMode = workMode;
    if (experienceLevel) where.experienceLevel = experienceLevel;

    let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: 'desc' };

    if (sortBy === 'salary') {
      orderBy = { salaryMax: 'desc' };
    }

    const [data, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
        },
        orderBy,
      }),
      this.prisma.job.count({ where }),
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
    this.logger.log({ userId, jobId: id }, 'Updating job');
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

  async apply(userId: string, jobId: string, dto: ApplyJobDto) {
    this.logger.log({ userId, jobId }, 'Applying for job');
    const { coverLetter, resumeId } = dto;

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

    // Validate Resume if provided
    if (resumeId) {
      const resume = await this.prisma.resume.findUnique({ where: { id: resumeId } });
      if (!resume) throw new BadRequestException('Resume not found');
      if (resume.candidateProfileId !== candidateProfile.id) {
        throw new ForbiddenException('This resume does not belong to you');
      }
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
        resumeId,
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

  async getMyApplication(userId: string, jobId: string) {
    // First get the candidate profile for this user
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) {
      return null;
    }

    // Find the application for this job
    const application = await this.prisma.application.findUnique({
      where: {
        jobId_candidateProfileId: {
          jobId,
          candidateProfileId: candidateProfile.id,
        },
      },
      select: {
        id: true,
        status: true,
        appliedAt: true,
      },
    });

    return application;
  }

  async getMyAppliedJobs(userId: string) {
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) return [];

    const applications = await this.prisma.application.findMany({
      where: { candidateProfileId: candidateProfile.id },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    return applications.map((app) => ({
      ...app.job,
      applicationStatus: app.status,
      appliedAt: app.appliedAt,
    }));
  }
}
