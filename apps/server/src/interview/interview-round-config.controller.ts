import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InterviewRoundConfigService } from './interview-round-config.service';
import { CreateRoundConfigDto } from './dto/create-round-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@repo/shared-types';

@ApiTags('interview-rounds')
@Controller('jobs/:id/rounds')
export class InterviewRoundConfigController {
  constructor(private readonly service: InterviewRoundConfigService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a round configuration to a job' })
  @ApiResponse({ status: 201, description: 'Round created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 409, description: 'Round number conflict' })
  create(@Req() req: RequestWithUser, @Param('id') jobId: string, @Body() dto: CreateRoundConfigDto) {
    return this.service.create(req.user.id, jobId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List round configurations for a job' })
  @ApiResponse({ status: 200, description: 'List of rounds' })
  findAll(@Param('id') jobId: string) {
    return this.service.findAll(jobId);
  }

  @Delete(':roundNumber')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a round configuration' })
  @ApiResponse({ status: 200, description: 'Round deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Round not found' })
  remove(
    @Req() req: RequestWithUser,
    @Param('id') jobId: string,
    @Param('roundNumber', ParseIntPipe) roundNumber: number
  ) {
    return this.service.remove(req.user.id, jobId, roundNumber);
  }
}
