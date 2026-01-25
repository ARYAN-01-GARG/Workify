---
description: Backend development standards for NestJS server application
---

# Backend Development Standards

> [!IMPORTANT] Follow NestJS best practices. Modules are self-contained. Controllers are thin. Services hold business
> logic.

---

## 📂 Module Structure

Each feature should have its own module with this structure:

```
src/[feature]/
├── [feature].module.ts       # Module definition
├── [feature].controller.ts   # HTTP endpoints (thin, delegates to service)
├── [feature].service.ts      # Business logic
├── dto/
│   ├── create-[feature].dto.ts
│   └── update-[feature].dto.ts
└── entities/                 # Optional: if using TypeORM entities
```

---

## 📝 DTO Pattern

DTOs must be properly annotated for validation and Swagger documentation.

```typescript
// src/job/dto/create-job.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsEnum, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE',
}

export enum WorkMode {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  ONSITE = 'ONSITE',
}

export class CreateJobDto {
  @ApiProperty({
    description: 'Title of the job',
    example: 'Senior Software Engineer',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({
    description: 'Detailed job description',
    example: 'We are looking for a skilled engineer...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Job location',
    example: 'New York, NY',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  location: string;

  @ApiPropertyOptional({
    description: 'Minimum salary',
    example: 80000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum salary',
    example: 120000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @ApiProperty({
    description: 'Required skills',
    example: ['TypeScript', 'NestJS', 'React'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @ApiPropertyOptional({
    description: 'Type of employment',
    enum: JobType,
    example: JobType.FULL_TIME,
  })
  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @ApiPropertyOptional({
    description: 'Work mode',
    enum: WorkMode,
    example: WorkMode.REMOTE,
  })
  @IsOptional()
  @IsEnum(WorkMode)
  workMode?: WorkMode;
}
```

---

## 🎮 Controller Pattern

Controllers should be thin - only handle HTTP concerns.

```typescript
// src/job/job.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobQueryDto } from './dto/job-query.dto';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Recruiter role required' })
  async create(@CurrentUser() user: User, @Body() dto: CreateJobDto) {
    return this.jobService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs with filters' })
  @ApiResponse({ status: 200, description: 'List of jobs' })
  async findAll(@Query() query: JobQueryDto) {
    return this.jobService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiResponse({ status: 200, description: 'Job details' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a job' })
  async update(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobService.update(user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a job' })
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.jobService.remove(user.id, id);
  }
}
```

---

## ⚙️ Service Pattern

Services contain all business logic and database operations.

```typescript
// src/job/job.service.ts
import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobQueryDto } from './dto/job-query.dto';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateJobDto) {
    this.logger.log(`Creating job for user ${userId}`);

    // Verify user is a recruiter
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { recruiterProfile: true },
    });

    if (!user?.recruiterProfile) {
      throw new ForbiddenException('Only recruiters can create job postings');
    }

    return this.prisma.job.create({
      data: {
        ...dto,
        postedById: userId,
        companyId: user.recruiterProfile.companyId,
      },
      include: {
        company: true,
        postedBy: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });
  }

  async findAll(query: JobQueryDto) {
    const { page = 1, limit = 20, query: search, location, type, workMode, experienceLevel } = query;
    const skip = (page - 1) * limit;

    const where = {
      status: 'OPEN',
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(location && { location: { contains: location, mode: 'insensitive' } }),
      ...(type && { type }),
      ...(workMode && { workMode }),
      ...(experienceLevel && { experienceLevel }),
    };

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: true,
          postedBy: {
            select: { id: true, name: true, avatarUrl: true },
          },
          _count: { select: { applications: true } },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      hasMore: skip + items.length < total,
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        postedBy: {
          select: { id: true, name: true, avatarUrl: true, email: true },
        },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(userId: string, id: string, dto: UpdateJobDto) {
    const job = await this.findOne(id);

    if (job.postedById !== userId) {
      throw new ForbiddenException('You can only update your own job postings');
    }

    return this.prisma.job.update({
      where: { id },
      data: dto,
      include: {
        company: true,
        postedBy: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    const job = await this.findOne(id);

    if (job.postedById !== userId) {
      throw new ForbiddenException('You can only delete your own job postings');
    }

    await this.prisma.job.delete({ where: { id } });
    this.logger.log(`Job ${id} deleted by user ${userId}`);
  }
}
```

---

## 🔒 Security Checklist

- [ ] All sensitive routes protected with `@UseGuards(JwtAuthGuard)`
- [ ] DTOs validate and sanitize all inputs
- [ ] Use `@CurrentUser()` decorator to get authenticated user
- [ ] Never trust client-provided user IDs for authorization
- [ ] Use Prisma transactions for multi-step operations
- [ ] Log important operations with context

---

## 📊 Error Handling

Use NestJS built-in exceptions:

```typescript
import {
  BadRequestException, // 400 - Invalid input
  UnauthorizedException, // 401 - Not authenticated
  ForbiddenException, // 403 - Not authorized
  NotFoundException, // 404 - Resource not found
  ConflictException, // 409 - Duplicate resource
} from '@nestjs/common';

// Examples
throw new NotFoundException(`User with ID ${id} not found`);
throw new ForbiddenException('You do not have permission to perform this action');
throw new BadRequestException('Invalid email format');
```

---

## 🧪 Testing Pattern

```typescript
// src/job/job.service.spec.ts
import { Test } from '@nestjs/testing';
import { JobService } from './job.service';
import { PrismaService } from '../prisma/prisma.service';

describe('JobService', () => {
  let service: JobService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: PrismaService,
          useValue: {
            job: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more test cases...
});
```
