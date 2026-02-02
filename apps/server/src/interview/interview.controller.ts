import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@repo/shared-types';

@ApiTags('interviews')
@Controller()
export class InterviewController {
  constructor(private readonly service: InterviewService) {}

  @Post('interviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule an interview' })
  @ApiResponse({ status: 201, description: 'Interview scheduled' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  create(@Req() req: RequestWithUser, @Body() dto: CreateInterviewDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get('interviews/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get interview details' })
  @ApiResponse({ status: 200, description: 'Interview details' })
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.service.findOne(req.user.id, id);
  }

  @Patch('interviews/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update interview status or feedback' })
  @ApiResponse({ status: 200, description: 'Updated' })
  update(@Req() req: RequestWithUser, @Param('id') id: string, @Body() dto: UpdateInterviewDto) {
    return this.service.update(req.user.id, id, dto);
  }

  @Get('jobs/:id/applications/:appId/interviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List interviews for an application' })
  getByApplication(@Req() req: RequestWithUser, @Param('appId') appId: string) {
    return this.service.getByApplication(req.user.id, appId);
  }
}
