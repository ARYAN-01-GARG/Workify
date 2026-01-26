import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConnectionStatus } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService
  ) {}

  async sendRequest(senderId: string, receiverId: string) {
    this.logger.log({ senderId, receiverId }, 'Sending connection request');
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send connection request to yourself');
    }

    const existing = await this.prisma.connection.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      if (existing.status === ConnectionStatus.REJECTED) {
        // Recycle the existing record
        return this.prisma.connection.update({
          where: { id: existing.id },
          data: {
            senderId,
            receiverId,
            status: ConnectionStatus.PENDING,
          },
        });
      }

      const message =
        existing.status === ConnectionStatus.ACCEPTED
          ? 'You are already connected'
          : 'Connection request already exists';
      throw new BadRequestException(message);
    }

    return this.prisma.connection.create({
      data: {
        senderId,
        receiverId,
        status: ConnectionStatus.PENDING,
      },
    });
  }

  async updateStatus(connectionId: string, userId: string, status: ConnectionStatus) {
    this.logger.log({ userId, connectionId, status }, 'Updating connection status');
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    if (connection.receiverId !== userId) {
      throw new BadRequestException('Only the receiver can accept or reject this request');
    }

    if (status === ConnectionStatus.PENDING) {
      throw new BadRequestException('Cannot set status back to PENDING');
    }

    return this.prisma.connection.update({
      where: { id: connectionId },
      data: { status },
    });
  }

  async getConnections(userId: string) {
    return this.prisma.connection.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: ConnectionStatus.ACCEPTED,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  async getPendingRequests(userId: string) {
    return this.prisma.connection.findMany({
      where: {
        receiverId: userId,
        status: ConnectionStatus.PENDING,
      },
      include: {
        sender: true,
      },
    });
  }

  async remove(connectionId: string, userId: string) {
    this.logger.warn({ userId, connectionId }, 'Removing connection');
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }
    const isSender = connection.senderId === userId;
    const isReceiver = connection.receiverId === userId;

    if (!isSender && !isReceiver) {
      throw new BadRequestException('You are not authorized to remove this connection');
    }

    if (connection.status === ConnectionStatus.PENDING) {
      if (!isSender) {
        throw new BadRequestException('Only the sender can cancel a pending request');
      }
    }

    return this.prisma.connection.delete({
      where: { id: connectionId },
    });
  }
}
