import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationStatusService } from './application-status.service';
import { ApplicationStatus, UserRole } from '@repo/db';
import { BadRequestException } from '@nestjs/common';

describe('ApplicationStatusService', () => {
  let service: ApplicationStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationStatusService],
    }).compile();

    service = module.get<ApplicationStatusService>(ApplicationStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateTransition', () => {
    it('should allow valid transition PENDING -> REVIEWING for RECRUITER', () => {
      expect(() =>
        service.validateTransition(ApplicationStatus.PENDING, ApplicationStatus.REVIEWING, UserRole.RECRUITER)
      ).not.toThrow();
    });

    it('should throw BadRequestException for invalid transition PENDING -> ACCEPTED', () => {
      expect(() =>
        service.validateTransition(ApplicationStatus.PENDING, ApplicationStatus.ACCEPTED, UserRole.RECRUITER)
      ).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for valid transition but unauthorized role', () => {
      expect(() =>
        service.validateTransition(ApplicationStatus.PENDING, ApplicationStatus.REVIEWING, UserRole.CANDIDATE)
      ).toThrow(BadRequestException);
    });

    it('should allow CANDIDATE to WITHDRAW from PENDING', () => {
      expect(() =>
        service.validateTransition(ApplicationStatus.PENDING, ApplicationStatus.WITHDRAWN, UserRole.CANDIDATE)
      ).not.toThrow();
    });

    it('should NOT allow CANDIDATE to WITHDRAW from SHORTLISTED', () => {
      expect(() =>
        service.validateTransition(ApplicationStatus.SHORTLISTED, ApplicationStatus.WITHDRAWN, UserRole.CANDIDATE)
      ).toThrow(BadRequestException);
    });

    it('should consider REJECTED as terminal state', () => {
      expect(() =>
        service.validateTransition(ApplicationStatus.REJECTED, ApplicationStatus.REVIEWING, UserRole.RECRUITER)
      ).toThrow(BadRequestException);
    });
  });
});
