import { IsArray, IsOptional, IsString } from 'class-validator';
import type { IUpdateCandidateProfile, IUpdateRecruiterProfile } from '@repo/shared-types';

export class UpdateCandidateProfileDto implements IUpdateCandidateProfile {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  education?: any;

  @IsOptional()
  experience?: any;
}

export class UpdateRecruiterProfileDto implements IUpdateRecruiterProfile {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  companyId?: string;
}
