import { ConnectionStatus } from '@repo/db';

export interface IConnectionRequest {
  receiverId: string;
}

export interface IUpdateConnectionStatus {
  status: ConnectionStatus;
}

export interface IConnectionResponse {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt?: Date; // Prisma specific usually, but helpful
}
