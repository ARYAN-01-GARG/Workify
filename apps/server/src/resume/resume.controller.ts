import { Controller, Get, Post, Delete, UseGuards, Req, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { ResumeService } from './resume.service';
import { RequestWithUser } from '@repo/shared-types';

@ApiTags('Resumes')
@Controller('resumes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a resume' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    return this.resumeService.uploadResume(req.user.id, file);
  }

  @Get()
  @ApiOperation({ summary: 'List my resumes' })
  async getMyResumes(@Req() req: RequestWithUser) {
    return this.resumeService.getMyResumes(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a resume' })
  async deleteResume(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.resumeService.deleteResume(req.user.id, id);
  }
}
