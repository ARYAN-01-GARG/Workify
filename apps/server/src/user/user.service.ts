import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCandidateProfileDto, UpdateRecruiterProfileDto } from './dto/update-profile.dto';

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

    // Update User common fields
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        about,
      },
    });

    // Update Candidate Profile
    await this.prisma.candidateProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...profileData,
      },
      update: {
        ...profileData,
      },
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
