import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoundConfigDto } from './dto/create-round-config.dto';
import { UserRole } from '@repo/db';

@Injectable()
export class InterviewRoundConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, jobId: string, dto: CreateRoundConfigDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('User not found');

    if (user.role !== UserRole.ADMIN) {
      if (job.postedById !== userId) {
        throw new ForbiddenException('You can only add rounds to your own jobs');
      }
    }

    const existing = await this.prisma.interviewRoundConfig.findUnique({
      where: { jobId_roundNumber: { jobId, roundNumber: dto.roundNumber } },
    });

    if (existing) {
      throw new ConflictException('Round number already exists');
    }

    return this.prisma.interviewRoundConfig.create({
      data: {
        jobId,
        ...dto,
      },
    });
  }

  async findAll(jobId: string) {
    return this.prisma.interviewRoundConfig.findMany({
      where: { jobId },
      orderBy: { roundNumber: 'asc' },
    });
  }

  async remove(userId: string, jobId: string, roundNumber: number) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('User not found');

    if (user.role !== UserRole.ADMIN && job.postedById !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    try {
      return await this.prisma.interviewRoundConfig.delete({
        where: { jobId_roundNumber: { jobId, roundNumber } },
      });
    } catch (error) {
      throw new NotFoundException('Round not found');
    }
  }
}
