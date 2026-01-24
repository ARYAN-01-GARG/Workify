import { Body, Controller, Get, Patch, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConnectionService } from './connection.service';
import { ConnectionRequestDto, UpdateConnectionStatusDto } from './dto/connection.dto';

@ApiTags('Connections')
@Controller('connections')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post()
  @ApiOperation({ summary: 'Send connection request' })
  async sendRequest(@Req() req: any, @Body() body: ConnectionRequestDto) {
    return this.connectionService.sendRequest(req.user.id, body.receiverId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Accept or Reject connection request' })
  async updateStatus(@Req() req: any, @Param('id') id: string, @Body() body: UpdateConnectionStatusDto) {
    return this.connectionService.updateStatus(id, req.user.id, body.status);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accepted connections' })
  async getConnections(@Req() req: any) {
    return this.connectionService.getConnections(req.user.id);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending received requests' })
  async getPendingRequests(@Req() req: any) {
    return this.connectionService.getPendingRequests(req.user.id);
  }
}
