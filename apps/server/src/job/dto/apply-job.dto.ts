import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyJobDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  resumeId?: string;
}
