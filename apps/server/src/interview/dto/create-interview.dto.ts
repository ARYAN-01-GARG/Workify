import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateInterviewDto {
  @ApiProperty({ example: 'uuid', description: 'Application ID' })
  @IsUUID()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty({ example: 1, description: 'Round number' })
  @IsInt()
  @IsNotEmpty()
  roundNumber: number;

  @ApiProperty({ example: 'uuid', description: 'User ID of the interviewer' })
  @IsUUID()
  @IsNotEmpty()
  assignedTo: string;

  @ApiProperty({ example: '2024-02-01T10:00:00Z', description: 'Scheduled time', required: false })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;
}
