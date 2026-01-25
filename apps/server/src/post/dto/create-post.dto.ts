import { IsString, IsOptional, IsArray, IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Hello world!', description: 'The content of the post' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: ['https://example.com/image.jpg'], description: 'Array of media URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  mediaUrls?: string[];

  @ApiPropertyOptional({ example: ['tech', 'news'], description: 'Array of tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
