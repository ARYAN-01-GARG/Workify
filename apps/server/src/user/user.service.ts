import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCandidateProfileDto, UpdateRecruiterProfileDto } from './dto/update-profile.dto';
import { Prisma } from '@repo/db';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: true,
        recruiterProfile: {
          include: { company: true },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateCandidateProfile(userId: string, dto: UpdateCandidateProfileDto) {
    const { name, bio, about, ...profileData } = dto;

    // Transaction to ensure atomicity
    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update User Common Fields
      await tx.user.update({
        where: { id: userId },
        data: { name, bio, about },
      });

      // 2. Update/Create Candidate Profile Scalars
      const { education, experience, ...scalarData } = profileData;

      const profile = await tx.candidateProfile.upsert({
        where: { userId },
        create: {
          userId,
          ...scalarData,
        },
        update: {
          ...scalarData,
        },
      });

      // 3. Handle Education (Replace All Strategy)
      if (education) {
        await tx.education.deleteMany({ where: { candidateProfileId: profile.id } });
        if (education.length > 0) {
          await tx.education.createMany({
            data: education.map((edu) => ({
              ...edu,
              candidateProfileId: profile.id,
              // Parse dates if they are strings (DTO validations ensures they are date strings)
              startDate: new Date(edu.startDate),
              endDate: edu.endDate ? new Date(edu.endDate) : null,
            })),
          });
        }
      }

      // 4. Handle Experience (Replace All Strategy)
      if (experience) {
        await tx.experience.deleteMany({ where: { candidateProfileId: profile.id } });
        if (experience.length > 0) {
          await tx.experience.createMany({
            data: experience.map((exp) => ({
              ...exp,
              candidateProfileId: profile.id,
              startDate: new Date(exp.startDate),
              endDate: exp.endDate ? new Date(exp.endDate) : null,
            })),
          });
        }
      }
    });

    return this.getProfile(userId);
  }

  async updateRecruiterProfile(userId: string, dto: UpdateRecruiterProfileDto) {
    const { name, bio, about, companyId } = dto;

    // Update User common fields
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        about,
      },
    });

    // Update Recruiter Profile
    if (companyId) {
      const company = await this.prisma.company.findUnique({ where: { id: companyId } });
      if (!company) {
        throw new BadRequestException('Invalid companyId');
      }

      await this.prisma.recruiterProfile.upsert({
        where: { userId },
        create: {
          userId,
          companyId,
        },
        update: {
          companyId,
        },
      });
    }

    return this.getProfile(userId);
  }
}
