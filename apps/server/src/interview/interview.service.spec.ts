import { Test, TestingModule } from '@nestjs/testing';
import { InterviewService } from './interview.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { UserRole, InterviewRoundType } from '@repo/db';

const mockPrismaService = {
  application: {
    findUnique: jest.fn(),
  },
  interviewRoundConfig: {
    findUnique: jest.fn(),
  },
  interview: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

describe('InterviewService', () => {
  let service: InterviewService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterviewService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<InterviewService>(InterviewService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: CreateInterviewDto = {
      applicationId: 'app-1',
      roundNumber: 1,
      assignedTo: 'user-2',
      scheduledAt: new Date().toISOString(),
    };
    const userId = 'user-1';

    it('should create interview if all checks pass', async () => {
      prisma.application.findUnique.mockResolvedValue({ jobId: 'job-1', job: { postedById: 'user-1' } });
      prisma.interviewRoundConfig.findUnique.mockResolvedValue({ roundType: InterviewRoundType.TECHNICAL });
      prisma.interview.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2' });
      prisma.interview.create.mockResolvedValue({ id: 'interview-1', ...createDto });

      const result = await service.create(userId, createDto);

      expect(prisma.interview.create).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ id: 'interview-1' }));
    });

    it('should throw ForbiddenException if user is not job owner', async () => {
      prisma.application.findUnique.mockResolvedValue({ jobId: 'job-1', job: { postedById: 'other-user' } });
      await expect(service.create(userId, createDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if round not configured', async () => {
      prisma.application.findUnique.mockResolvedValue({ jobId: 'job-1', job: { postedById: 'user-1' } });
      prisma.interviewRoundConfig.findUnique.mockResolvedValue(null);
      await expect(service.create(userId, createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if interview already exists', async () => {
      prisma.application.findUnique.mockResolvedValue({ jobId: 'job-1', job: { postedById: 'user-1' } });
      prisma.interviewRoundConfig.findUnique.mockResolvedValue({ roundType: InterviewRoundType.TECHNICAL });
      prisma.interview.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(service.create(userId, createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const interviewId = 'interview-1';
    const dto = { feedback: 'Good', rating: 4 };

    it('should allow assigned reviewer to update feedback', async () => {
      prisma.interview.findUnique.mockResolvedValue({
        id: interviewId,
        assignedTo: 'reviewer-1',
        application: { job: { postedById: 'owner-1' } },
        feedback: null,
      });

      await service.update('reviewer-1', interviewId, dto);
      expect(prisma.interview.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not assigned reviewer or owner', async () => {
      prisma.interview.findUnique.mockResolvedValue({
        id: interviewId,
        assignedTo: 'reviewer-1',
        application: { job: { postedById: 'owner-1' } },
      });
      prisma.user.findUnique.mockResolvedValue({ role: UserRole.CANDIDATE }); // not admin

      await expect(service.update('random-user', interviewId, dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if non-assigned user tries to leave feedback', async () => {
      prisma.interview.findUnique.mockResolvedValue({
        id: interviewId,
        assignedTo: 'reviewer-1',
        application: { job: { postedById: 'owner-1' } },
      });

      // Owner tries to leave feedback
      await expect(service.update('owner-1', interviewId, dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if feedback already exists (overwrite protection)', async () => {
      prisma.interview.findUnique.mockResolvedValue({
        id: interviewId,
        assignedTo: 'reviewer-1',
        application: { job: { postedById: 'owner-1' } },
        feedback: 'Old feedback',
        rating: 5,
      });

      await expect(service.update('reviewer-1', interviewId, dto)).rejects.toThrow(BadRequestException);
    });
  });
});
