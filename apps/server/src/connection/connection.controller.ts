import { Body, Controller, Delete, Get, Patch, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConnectionService } from './connection.service';
import { ConnectionRequestDto, UpdateConnectionStatusDto } from './dto/connection.dto';
import { RequestWithUser } from '@repo/shared-types';

@ApiTags('Connections')
@Controller('connections')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post()
  @ApiOperation({ summary: 'Send connection request', description: 'Sends a connection request to another user.' })
  @ApiResponse({ status: 201, description: 'Connection request sent' })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., Self-connection or Loop)' })
  async sendRequest(@Req() req: RequestWithUser, @Body() body: ConnectionRequestDto) {
    return this.connectionService.sendRequest(req.user.id, body.receiverId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Accept or Reject connection request',
    description: 'Updates the status of a pending connection request.',
  })
  @ApiResponse({ status: 200, description: 'Connection status updated' })
  @ApiResponse({ status: 404, description: 'Connection not found' })
  async updateStatus(@Req() req: RequestWithUser, @Param('id') id: string, @Body() body: UpdateConnectionStatusDto) {
    return this.connectionService.updateStatus(id, req.user.id, body.status);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all accepted connections',
    description: 'Retrieves a list of all accepted connections for the user.',
  })
  @ApiResponse({ status: 200, description: 'List of connections' })
  async getConnections(@Req() req: RequestWithUser) {
    return this.connectionService.getConnections(req.user.id);
  }

  @Get('pending')
  @ApiOperation({
    summary: 'Get pending received requests',
    description: 'Retrieves a list of pending connection requests received by the user.',
  })
  @ApiResponse({ status: 200, description: 'List of pending requests' })
  async getPendingRequests(@Req() req: RequestWithUser) {
    return this.connectionService.getPendingRequests(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel connection request', description: 'Cancels a pending connection request.' })
  @ApiResponse({ status: 200, description: 'Connection request cancelled' })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., Not sender, Not pending)' })
  @ApiResponse({ status: 404, description: 'Connection not found' })
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.connectionService.remove(id, req.user.id);
  }
}
