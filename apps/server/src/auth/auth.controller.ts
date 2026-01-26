import { AuthService } from './auth.service';
import { Request } from 'express';
import { GoogleAuthDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({
    summary: 'Register with OTP and Password',
    description: 'Verifies OTP, creates user with password, and returns token.',
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request (Invalid OTP, User exists)' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Login with Email and Password',
    description: 'Authenticates user with email and password.',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('send-otp')
  @Public()
  @ApiOperation({
    summary: 'Send OTP to email',
    description: 'Sends a 6-digit OTP to the provided email address for verification.',
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendOtp(@Body() body: SendOtpDto) {
    return this.authService.sendOtp(body.email);
  }

  @Post('verify-otp')
  @Public()
  @ApiOperation({
    summary: 'Verify OTP and Login/Register',
    description: 'Verifies the OTP and returns a JWT token. Creates a new user if one does not exist.',
  })
  @ApiResponse({ status: 200, description: 'Returns JWT token and user' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body.email, body.otp);
  }

  @Post('google')
  @Public()
  @ApiOperation({
    summary: 'Login with Google ID Token',
    description: 'Verifies Google ID token and returns JWT token.',
  })
  @ApiResponse({ status: 201, description: 'Returns JWT token and user' })
  @ApiResponse({ status: 401, description: 'Invalid Google ID token' })
  async googleAuth(@Req() req: Request, @Body() body: GoogleAuthDto) {
    const token = body?.idToken || req.body?.idToken;
    return this.authService.handleGoogleAuth(token);
  }
}
