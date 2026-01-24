import { IsEnum, IsString } from 'class-validator';
import { ConnectionStatus } from '@repo/db';
import type { IConnectionRequest, IUpdateConnectionStatus } from '@repo/shared-types';

export class ConnectionRequestDto implements IConnectionRequest {
  @IsString()
  receiverId: string;
}

export class UpdateConnectionStatusDto implements IUpdateConnectionStatus {
  @IsEnum(ConnectionStatus)
  status: ConnectionStatus;
}
