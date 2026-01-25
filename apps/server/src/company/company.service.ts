import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { CompanyQueryDto } from './dto/company-query.dto';
import { Prisma } from '@repo/db';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCompanyDto) {
    // Check if user is a recruiter (Guard handles role, but we need profile)
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (recruiterProfile && recruiterProfile.companyId) {
      throw new BadRequestException('You are already associated with a company');
    }

    // Transaction: Create Company -> Link Recruiter
    try {
      return await this.prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: {
            ...dto,
          },
        });

        await tx.recruiterProfile.upsert({
          where: { userId },
          create: { userId, companyId: company.id },
          update: { companyId: company.id },
        });

        return company;
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Company name already exists');
      }
      throw error;
    }
  }

  async findAll(query: CompanyQueryDto) {
    const { page = 1, limit = 20, search, industry, location } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CompanyWhereInput = {};

    if (search) {
      const sanitizedSearch = this.sanitizeInput(search);
      where.OR = [
        { name: { contains: sanitizedSearch, mode: 'insensitive' } },
        { description: { contains: sanitizedSearch, mode: 'insensitive' } },
      ];
    }

    if (industry) {
      where.industry = { contains: industry, mode: 'insensitive' };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: { jobs: true, recruiters: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        jobs: true,
        recruiters: {
          include: { user: true },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async update(id: string, userId: string, dto: UpdateCompanyDto) {
    // Check permissions: User must be a recruiter for THIS company
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiterProfile || recruiterProfile.companyId !== id) {
      throw new BadRequestException('You are not authorized to edit this company');
    }

    return this.prisma.company.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiterProfile || recruiterProfile.companyId !== id) {
      throw new BadRequestException('You are not authorized to delete this company');
    }

    // Check for dependencies
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: { jobs: true, recruiters: true },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company._count.jobs > 0) {
      throw new BadRequestException('Cannot delete company with active jobs. Please delete them first.');
    }

    if (company._count.recruiters > 1) {
      throw new BadRequestException('Cannot delete company with other associated recruiters.');
    }

    // Disconnect current recruiter (self) before deletion to avoid foreign key constraint failure
    // (Since we made companyId optional, we can set it to null)
    await this.prisma.recruiterProfile.update({
      where: { userId },
      data: { companyId: null },
    });

    return this.prisma.company.delete({
      where: { id },
    });
  }

  private sanitizeInput(input: string): string {
    return input.replace(/[<>]/g, '');
  }
}
