import { Injectable, BadRequestException } from '@nestjs/common';
import { ApplicationStatus, UserRole } from '@repo/db';

type TransitionRule = {
  to: ApplicationStatus;
  roles: UserRole[];
};

@Injectable()
export class ApplicationStatusService {
  private allowedTransitions: Record<ApplicationStatus, TransitionRule[]> = {
    [ApplicationStatus.PENDING]: [
      { to: ApplicationStatus.REVIEWING, roles: [UserRole.RECRUITER, UserRole.ADMIN] },
      { to: ApplicationStatus.WITHDRAWN, roles: [UserRole.CANDIDATE] },
    ],
    [ApplicationStatus.REVIEWING]: [
      { to: ApplicationStatus.SHORTLISTED, roles: [UserRole.RECRUITER, UserRole.ADMIN] },
      { to: ApplicationStatus.REJECTED, roles: [UserRole.RECRUITER, UserRole.ADMIN] },
      { to: ApplicationStatus.WITHDRAWN, roles: [UserRole.CANDIDATE] },
    ],
    [ApplicationStatus.SHORTLISTED]: [
      { to: ApplicationStatus.ACCEPTED, roles: [UserRole.RECRUITER, UserRole.ADMIN] },
      { to: ApplicationStatus.REJECTED, roles: [UserRole.RECRUITER, UserRole.ADMIN] },
      // Candidate cannot withdraw once shortlisted (implied by absence)
    ],
    [ApplicationStatus.ACCEPTED]: [], // Terminal
    [ApplicationStatus.REJECTED]: [], // Terminal
    [ApplicationStatus.WITHDRAWN]: [], // Terminal
  };

  validateTransition(currentStatus: ApplicationStatus, nextStatus: ApplicationStatus, role: UserRole): void {
    if (currentStatus === nextStatus) return;

    const allowed = this.allowedTransitions[currentStatus] || [];
    const rule = allowed.find((r) => r.to === nextStatus);

    if (!rule) {
      throw new BadRequestException(`Transition from ${currentStatus} to ${nextStatus} is not allowed.`);
    }

    if (!rule.roles.includes(role)) {
      throw new BadRequestException(
        `User with role ${role} is not authorized to perform transition from ${currentStatus} to ${nextStatus}.`
      );
    }
  }

  isValidTransition(currentStatus: ApplicationStatus, nextStatus: ApplicationStatus): boolean {
    const allowed = this.allowedTransitions[currentStatus] || [];
    return allowed.some((r) => r.to === nextStatus);
  }
}
