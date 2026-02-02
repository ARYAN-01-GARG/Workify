import { ApiProperty } from '@nestjs/swagger';
import { InterviewRoundType } from '@repo/db';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateRoundConfigDto {
  @ApiProperty({
    enum: InterviewRoundType,
    example: InterviewRoundType.TECHNICAL,
    description: 'Type of the interview round',
  })
  @IsEnum(InterviewRoundType)
  roundType: InterviewRoundType;

  @ApiProperty({
    example: 1,
    description: 'Order of the round (1-based)',
  })
  @IsNumber()
  roundNumber: number;

  @ApiProperty({
    example: true,
    description: 'Is this round required?',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}
