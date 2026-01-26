import { ApiProperty } from '@nestjs/swagger';
import { JobType, WorkMode, ExperienceLevel } from '@repo/db';
import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

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

  @ApiProperty({ required: false, default: 1, description: 'Page number for pagination' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20, description: 'Number of items per page' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({ required: false, description: 'Filter by skills (comma separated)' })
  @IsOptional()
  @IsString()
  skills?: string;

  @ApiProperty({
    required: false,
    enum: ['ALL', 'LAST_24_HOURS', 'LAST_7_DAYS', 'LAST_30_DAYS'],
    description: 'Filter by date posted',
  })
  @IsOptional()
  @IsEnum(['ALL', 'LAST_24_HOURS', 'LAST_7_DAYS', 'LAST_30_DAYS'])
  datePosted?: 'ALL' | 'LAST_24_HOURS' | 'LAST_7_DAYS' | 'LAST_30_DAYS';

  @ApiProperty({ required: false, enum: ['newest', 'salary'], description: 'Sort order' })
  @IsOptional()
  @IsEnum(['newest', 'salary'])
  sortBy?: 'newest' | 'salary';
}
