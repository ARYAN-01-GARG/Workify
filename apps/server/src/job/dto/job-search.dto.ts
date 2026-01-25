import { ApiProperty } from '@nestjs/swagger';
import { JobType, WorkMode, ExperienceLevel } from '@repo/db';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class JobSearchDto {
  @ApiProperty({ required: false, description: 'Search query for title or description' })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({ required: false, description: 'Filter by location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false, enum: JobType, description: 'Filter by job type' })
  @IsEnum(JobType)
  @IsOptional()
  type?: JobType;

  @ApiProperty({ required: false, enum: WorkMode, description: 'Filter by work mode' })
  @IsEnum(WorkMode)
  @IsOptional()
  workMode?: WorkMode;

  @ApiProperty({ required: false, enum: ExperienceLevel, description: 'Filter by experience level' })
  @IsEnum(ExperienceLevel)
  @IsOptional()
  experienceLevel?: ExperienceLevel;
}
