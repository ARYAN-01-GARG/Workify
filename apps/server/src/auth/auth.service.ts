import { JwtService } from '@nestjs/jwt';
import { Auth } from 'googleapis';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { google } from 'googleapis';
import { config } from 'src/common/config';
import { User, UserRole } from '@repo/db';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private oauth2Client: Auth.OAuth2Client;

  constructor(
    private readonly logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.callbackUrl
    );
  }

  // --- Password Flow ---

  async register(dto: RegisterDto) {
    this.logger.log({ email: dto.email }, 'Registering user');

    // 1. Verify OTP
    const validOtp = await this.prismaService.otp.findFirst({
      where: {
        email: dto.email,
        otp: dto.otp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!validOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // 2. Check if user exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 4. Create User
    const userRole: UserRole = 'CANDIDATE'; // Default role

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        role: userRole,
        isVerified: true,
      },
    });

    // 5. Create Profile
    await this.prismaService.candidateProfile.create({
      data: { userId: user.id },
    });

    // 6. Cleanup OTP
    await this.prismaService.otp.delete({ where: { id: validOtp.id } });

    // 7. Generate Token
    const token = await this.generateToken(user);
    const { password, ...result } = user;

    return { token, user: result };
  }

  async login(dto: LoginDto) {
    this.logger.log({ email: dto.email }, 'Logging in user');
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Obfuscate user existence
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      // If user exists but no password (e.g. OAuth only), prompt them or handle accordingly.
      // For now, treat as invalid credentials to avoid enumeration, or maybe allow if we want to prompt "Login with Google"
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user);
    const { password, ...result } = user;

    return { token, user: result };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // --- OTP Flow (Legacy/Alternative) ---

  async sendOtp(email: string) {
    this.logger.log({ email }, 'Sending OTP');
    // Use static OTP in development for easy testing, random in production
    const otp =
      process.env.NODE_ENV === 'development' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prismaService.otp.deleteMany({ where: { email } });

    await this.prismaService.otp.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    // Only log OTP in development environment
    if (process.env.NODE_ENV === 'development') {
      this.logger.log(`[DEV OTP] OTP for ${email} is: ${otp}`);
    } else {
      this.logger.log({ email }, 'OTP sent successfully');
    }

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(email: string, otp: string) {
    this.logger.debug({ email }, 'Verifying OTP');
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

    let user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      let userRole: UserRole = 'CANDIDATE';

      if (email === 'admin@workify.com') userRole = 'ADMIN';
      if (email === 'recruiter@workify.com') userRole = 'RECRUITER';

      user = await this.prismaService.user.create({
        data: {
          email,
          name: email.split('@')[0],
          role: userRole,
          isVerified: true,
        },
      });

      if (userRole === 'CANDIDATE') {
        await this.prismaService.candidateProfile.create({
          data: { userId: user.id },
        });
      } else if (userRole === 'RECRUITER') {
        // Recruiter profile will be created when they create/join a company
      }
    }

    const token = await this.generateToken(user);
    await this.prismaService.otp.delete({ where: { id: validOtp.id } });

    return { token, user };
  }

  // --- Google Flow ---

  async handleGoogleAuth(idToken: string) {
    this.logger.log('Handling Google Auth');
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

  private async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.signAsync(payload as any, {
      expiresIn: config.jwt.expiresIn || '30d',
    });
  }
}
