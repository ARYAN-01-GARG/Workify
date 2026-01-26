import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService, UploadResult } from './upload.service';
import { memoryStorage } from 'multer';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a single file to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (max 10MB, images/PDF/video)',
        },
      },
      required: ['file'],
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'Folder path in S3 (default: uploads)',
    example: 'posts',
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://bucket.s3.region.amazonaws.com/posts/uuid.jpg' },
        key: { type: 'string', example: 'posts/uuid.jpg' },
        filename: { type: 'string', example: 'image.jpg' },
        mimetype: { type: 'string', example: 'image/jpeg' },
        size: { type: 'number', example: 123456 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file or file type' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.uploadService.uploadFile(file, folder || 'uploads');
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files to S3 (max 5 files)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to upload (max 5 files, 10MB each)',
        },
      },
      required: ['files'],
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'Folder path in S3 (default: uploads)',
    example: 'posts',
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          key: { type: 'string' },
          filename: { type: 'string' },
          mimetype: { type: 'string' },
          size: { type: 'number' },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string
  ): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    return this.uploadService.uploadMultipleFiles(files, folder || 'uploads');
  }
}
