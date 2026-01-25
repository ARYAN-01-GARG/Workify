import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@repo/db';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobSearchDto } from './dto/job-search.dto';
import { ApplicationQueryDto } from './dto/application-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../common/guards/roles.guard';
import { RequestWithUser } from '@repo/shared-types';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({ status: 201, description: 'Job successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Recruiter role required' })
  create(@Req() req: RequestWithUser, @Body() createJobDto: CreateJobDto) {
    return this.jobService.create(req.user.id, createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter jobs', description: 'Returns a paginated list of jobs available.' })
  @ApiResponse({ status: 200, description: 'List of jobs found' })
  findAll(@Query() query: JobSearchDto) {
    return this.jobService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific job by ID' })
  @ApiResponse({ status: 200, description: 'Job details' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a job posting' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner or admin' })
  update(@Req() req: RequestWithUser, @Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(req.user.id, id, updateJobDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job posting' })
  @ApiResponse({ status: 200, description: 'Job deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner or admin' })
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.jobService.remove(req.user.id, id);
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  @ApiResponse({ status: 400, description: 'Already applied or Job closed' })
  apply(@Req() req: RequestWithUser, @Param('id') id: string, @Body('coverLetter') coverLetter?: string) {
    return this.jobService.apply(req.user.id, id, coverLetter);
  }

  @Get(':id/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'View applications for a job',
    description: 'Returns a paginated list of applications for a job.',
  })
  @ApiResponse({ status: 200, description: 'List of applications' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  getApplications(@Req() req: RequestWithUser, @Param('id') id: string, @Query() query: ApplicationQueryDto) {
    return this.jobService.getApplications(req.user.id, id, query);
  }
}
