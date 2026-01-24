import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConnectionStatus } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConnectionService {
  constructor(private readonly prisma: PrismaService) {}

  async sendRequest(senderId: string, receiverId: string) {
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
      throw new BadRequestException('Connection request already exists');
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
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    // Only receiver can accept/reject (unless we allow cancelling by sender?)
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
}
