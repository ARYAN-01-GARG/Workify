import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Middleware to add a unique request ID to each incoming request.
 * This ID is used for log correlation and request tracing.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Use existing X-Request-ID header if present, otherwise generate a new one
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();

    // Attach to request object for use in logging
    req['requestId'] = requestId;

    // Add to response headers for client-side correlation
    res.setHeader('X-Request-ID', requestId);

    next();
  }
}
