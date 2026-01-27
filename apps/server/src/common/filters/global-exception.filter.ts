import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { Catch, HttpException } from '@nestjs/common';
import { Prisma } from '@repo/db';
import { Logger } from 'nestjs-pino';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    // Log the error with structure
    this.logger.error({ err: exception }, 'Exception caught in global filter');

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      response.status(status).json(typeof errorResponse === 'string' ? { message: errorResponse } : errorResponse);
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma error codes with appropriate HTTP status
      const prismaError = exception as Prisma.PrismaClientKnownRequestError;
      const prismaResponse = this.handlePrismaError(prismaError);
      response.status(prismaResponse.status).json({
        message: prismaResponse.message,
        code: prismaError.code,
      });
    } else if (
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientRustPanicError
    ) {
      // Database connection or internal errors
      response.status(503).json({ message: 'Database service unavailable. Please try again later.' });
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      response.status(400).json({ message: 'Invalid data format. Please check your request.' });
    } else if (exception instanceof Error) {
      response.status(500).json({ message: exception.message });
    } else {
      response.status(500).json({
        message: 'Something went wrong',
        data: exception,
      });
    }
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): { status: number; message: string } {
    switch (error.code) {
      case 'P2002': {
        // Unique constraint violation
        const target = (error.meta?.target as string[])?.join(', ') || 'field';
        return { status: 409, message: `A record with this ${target} already exists.` };
      }

      case 'P2025':
        // Record not found
        return { status: 404, message: 'The requested resource was not found.' };

      case 'P2003':
        // Foreign key constraint failed
        return { status: 400, message: 'Invalid reference. The related resource does not exist.' };

      case 'P2014':
        // Required relation violation
        return { status: 400, message: 'This operation would violate a required relationship.' };

      case 'P2016':
        // Query interpretation error
        return { status: 400, message: 'Invalid query parameters.' };

      default:
        return { status: 400, message: 'A database error occurred. Please try again.' };
    }
  }
}
