import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateCandidateProfileDto, UpdateRecruiterProfileDto } from './dto/update-profile.dto';
import { RequestWithUser } from '@repo/shared-types';
import { RolesGuard, Roles } from 'src/common/guards/roles.guard';
import { UserRole } from '@repo/db';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the profile of the currently authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Req() req: RequestWithUser) {
    return this.userService.getProfile(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user profile by ID',
    description: 'Returns the public profile of a user by their ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getPublicProfile(@Param('id') userId: string) {
    return this.userService.getPublicProfile(userId);
  }

  @Patch('profile/candidate')
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({
    summary: 'Update candidate profile',
    description: 'Updates the profile information for a candidate.',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async updateCandidateProfile(@Req() req: RequestWithUser, @Body() body: UpdateCandidateProfileDto) {
    return this.userService.updateCandidateProfile(req.user.id, body);
  }

  @Patch('profile/recruiter')
  @Roles(UserRole.RECRUITER)
  @ApiOperation({
    summary: 'Update recruiter profile',
    description: 'Updates the profile information for a recruiter, including company association.',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., Invalid Company ID)' })
  async updateRecruiterProfile(@Req() req: RequestWithUser, @Body() body: UpdateRecruiterProfileDto) {
    return this.userService.updateRecruiterProfile(req.user.id, body);
  }
}
