import { Module } from '@nestjs/common';
import { InterviewRoundConfigService } from './interview-round-config.service';
import { InterviewRoundConfigController } from './interview-round-config.controller';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [InterviewRoundConfigController, InterviewController],
  providers: [InterviewRoundConfigService, InterviewService],
  exports: [InterviewRoundConfigService, InterviewService],
})
export class InterviewModule {}
