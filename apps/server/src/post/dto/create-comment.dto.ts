import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Great post!', description: 'The content of the comment' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Parent comment ID for nested replies' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
