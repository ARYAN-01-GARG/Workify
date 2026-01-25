import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCompanyDto) {
    // Check if user is a recruiter (Guard handles role, but we need profile)
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiterProfile) {
      // Should ideally be created on signup, but safeguard
      throw new BadRequestException('Recruiter profile not found');
    }

    if (recruiterProfile.companyId) {
      throw new BadRequestException('You are already associated with a company');
    }

    // Transaction: Create Company -> Link Recruiter
    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          ...dto,
        },
      });

      await tx.recruiterProfile.update({
        where: { userId },
        data: { companyId: company.id },
      });

      return company;
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        _count: {
          select: { jobs: true, recruiters: true },
        },
      },
    });
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
}
