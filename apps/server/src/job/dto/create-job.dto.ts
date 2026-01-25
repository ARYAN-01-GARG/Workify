import { ApiProperty } from '@nestjs/swagger';
import { JobType, WorkMode, ExperienceLevel, JobStatus } from '@repo/db';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'Software Engineer', description: 'Title of the job' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'We are looking for a skilled Software Engineer...',
    description: 'Detailed description of the job',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 'New York, NY', description: 'Location of the job' })
  @IsString()
  location: string;

  @ApiProperty({
    example: 80000,
    description: 'Minimum salary',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salaryMin?: number;

  @ApiProperty({
    example: 120000,
    description: 'Maximum salary',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salaryMax?: number;

  @ApiProperty({ example: 'USD', description: 'Currency code', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    example: ['TypeScript', 'NestJS', 'React'],
    description: 'List of required skills',
  })
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty({
    enum: JobType,
    example: JobType.FULL_TIME,
    description: 'Type of employment',
  })
  @IsEnum(JobType)
  @IsOptional()
  type?: JobType;

  @ApiProperty({
    enum: WorkMode,
    example: WorkMode.REMOTE,
    description: 'Work mode',
  })
  @IsEnum(WorkMode)
  @IsOptional()
  workMode?: WorkMode;

  @ApiProperty({
    enum: ExperienceLevel,
    example: ExperienceLevel.MID,
    description: 'Required experience level',
  })
  @IsEnum(ExperienceLevel)
  @IsOptional()
  experienceLevel?: ExperienceLevel;

  @ApiProperty({
    enum: JobStatus,
    example: JobStatus.OPEN,
    description: 'Status of the job posting',
  })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;
}
