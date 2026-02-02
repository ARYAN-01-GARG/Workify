export type InterviewRoundType = 'TECHNICAL' | 'HR' | 'FINAL';

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum InterviewResult {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  ON_HOLD = 'ON_HOLD',
}
