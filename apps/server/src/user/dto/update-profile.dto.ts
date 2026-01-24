import { IsArray, IsBoolean, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { IUpdateCandidateProfile, IUpdateRecruiterProfile, IEducation, IExperience } from '@repo/shared-types';

export class EducationDto implements IEducation {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  school: string;

  @IsString()
  degree: string;

  @IsString()
  fieldOfStudy: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  activities?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ExperienceDto implements IExperience {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  employmentType: string;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsBoolean()
  currentlyWorking: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education?: EducationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience?: ExperienceDto[];
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
