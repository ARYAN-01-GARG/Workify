import { AuthService } from './auth.service';
import type { GoogleAuthDto } from './dto/auth.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @Public()
  async googleAuth(@Body() body: GoogleAuthDto) {
    return this.authService.handleGoogleAuth(body.idToken);
  }
}
