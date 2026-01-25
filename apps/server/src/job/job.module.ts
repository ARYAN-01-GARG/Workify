import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [PrismaModule, AuthModule, PassportModule],
  controllers: [JobController],
  providers: [JobService, JwtAuthGuard, RolesGuard],
})
export class JobModule {}
