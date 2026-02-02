import { ApiProperty } from '@nestjs/swagger';
import { InterviewStatus, InterviewResult } from '@repo/db';
import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class UpdateInterviewDto {
  @ApiProperty({
    enum: InterviewStatus,
    description: 'Status of the interview',
    required: false,
  })
  @IsEnum(InterviewStatus)
  @IsOptional()
  status?: InterviewStatus;

  @ApiProperty({
    enum: InterviewResult,
    description: 'Result of the interview',
    required: false,
  })
  @IsEnum(InterviewResult)
  @IsOptional()
  result?: InterviewResult;

  @ApiProperty({ description: 'Feedback comments', required: false })
  @IsString()
  @IsOptional()
  feedback?: string;

  @ApiProperty({ description: 'Rating (1-5)', required: false, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ description: 'Meeting link', required: false })
  @IsUrl()
  @IsOptional()
  meetLink?: string;
}
