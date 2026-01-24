import { JwtService } from '@nestjs/jwt';
import { Auth } from 'googleapis';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { google } from 'googleapis';
import { config } from 'src/common/config';
import { UserRole } from '@repo/db';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private oauth2Client: Auth.OAuth2Client;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.callbackUrl
    );
  }

  // --- OTP Flow ---

  async sendOtp(email: string, role?: UserRole) {
    // 1. Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 2. Store in DB (Simulating Redis with SQL for now as per plan)
    // First Clean up old OTps
    await this.prismaService.otp.deleteMany({ where: { email } });

    await this.prismaService.otp.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    // 3. Send Email (Mock)
    this.logger.log(`[MOCK EMAIL] OTP for ${email} is: ${otp}`);

    // If user exists, fine. If not, we don't creating yet.
    // We create user only on verification.

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(email: string, otp: string) {
    // 1. Check OTP
    const validOtp = await this.prismaService.otp.findFirst({
      where: {
        email,
        otp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!validOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // 2. Find or Create User
    let user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user (Default to CANDIDATE if not specified?
      // Ideally pass role in verify but let's default for now or require it)
      user = await this.prismaService.user.create({
        data: {
          email,
          name: email.split('@')[0], // Placeholder name
          role: 'CANDIDATE', // Default
          isVerified: true,
        },
      });

      // Initialize Profile
      await this.prismaService.candidateProfile.create({
        data: { userId: user.id },
      });
    }

    // 3. Generate Token
    const token = await this.generateToken(user);

    // 4. Cleanup OTP
    await this.prismaService.otp.delete({ where: { id: validOtp.id } });

    return { token, user };
  }

  // --- Google Flow ---

  async handleGoogleAuth(idToken: string) {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken,
        audience: config.google.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid google id token');
      }
      const { email, name, picture, sub: googleId } = payload;

      let user = await this.prismaService.user.findFirst({
        where: { email },
      });

      if (!user) {
        // Register new user via Google
        user = await this.prismaService.user.create({
          data: {
            email,
            name: name || 'Google User',
            avatarUrl: picture,
            role: 'CANDIDATE', // Default
            isVerified: true,
          },
        });
        // Init Profile
        await this.prismaService.candidateProfile.create({
          data: { userId: user.id },
        });
      }

      const token = await this.generateToken(user);

      return {
        token,
        user,
      };
    } catch (error) {
      this.logger.error(`error occured while verifying google id token: ${idToken}, ${error}`);
      throw new UnauthorizedException('Invalid google id token');
    }
  }

  private async generateToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn: config.jwt.expiresIn || '30d',
    });
  }
}
