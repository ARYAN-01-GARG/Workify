import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '@repo/db';
import { IsEnum } from 'class-validator';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    enum: ApplicationStatus,
    description: 'New status for the application',
    example: ApplicationStatus.REVIEWING,
  })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
