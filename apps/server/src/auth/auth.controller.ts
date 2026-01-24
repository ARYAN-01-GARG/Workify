import { AuthService } from './auth.service';
import type { GoogleAuthDto } from './dto/auth.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async googleAuth(@Body() body: GoogleAuthDto) {
    return this.authService.handleGoogleAuth(body.idToken);
  }
}
