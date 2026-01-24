import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateCandidateProfileDto, UpdateRecruiterProfileDto } from './dto/update-profile.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: any) {
    return this.userService.getProfile(req.user.id);
  }

  @Patch('profile/candidate')
  @ApiOperation({ summary: 'Update candidate profile' })
  async updateCandidateProfile(@Req() req: any, @Body() body: UpdateCandidateProfileDto) {
    return this.userService.updateCandidateProfile(req.user.id, body);
  }

  @Patch('profile/recruiter')
  @ApiOperation({ summary: 'Update recruiter profile' })
  async updateRecruiterProfile(@Req() req: any, @Body() body: UpdateRecruiterProfileDto) {
    return this.userService.updateRecruiterProfile(req.user.id, body);
  }
}
