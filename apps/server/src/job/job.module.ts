import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { InterviewModule } from '../interview/interview.module';

import { ApplicationStatusService } from './application-status.service';

@Module({
  imports: [PrismaModule, AuthModule, PassportModule, InterviewModule],
  controllers: [JobController],
  providers: [JobService, ApplicationStatusService, JwtAuthGuard, RolesGuard],
  exports: [ApplicationStatusService],
})
export class JobModule {}
