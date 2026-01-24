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
  @ApiOperation({ summary: 'Send OTP to email' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async sendOtp(@Body() body: SendOtpDto) {
    return this.authService.sendOtp(body.email);
  }

  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'Verify OTP and Login/Register' })
  @ApiResponse({ status: 200, description: 'Returns JWT token and user' })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body.email, body.otp);
  }

  @Post('google')
  @Public()
  @ApiOperation({ summary: 'Login with Google ID Token' })
  async googleAuth(@Body() body: GoogleAuthDto) {
    return this.authService.handleGoogleAuth(body.idToken);
  }
}
