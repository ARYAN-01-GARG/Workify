import type { ExecutionContext } from '@nestjs/common';
import type { RequestHint } from '@repo/shared-types/types';
import { createParamDecorator } from '@nestjs/common';

export const RequestHints = createParamDecorator((data: unknown, ctx: ExecutionContext): RequestHint => {
  const request = ctx.switchToHttp().getRequest();
  const latitudeHeader = (request.headers['x-latitude'] || request.headers['X-Latitude']) as string;
  const longitudeHeader = (request.headers['x-longitude'] || request.headers['X-Longitude']) as string;

  const requestHints = {
    city: (request.headers['x-city'] as string) || undefined,
    state: (request.headers['x-state'] as string) || undefined,
    country: (request.headers['x-country'] as string) || undefined,
    timezone: (request.headers['x-timezone'] as string) || undefined,
    latitude: latitudeHeader && latitudeHeader.trim() !== '' ? Number.parseFloat(latitudeHeader) : undefined,
    longitude: longitudeHeader && longitudeHeader.trim() !== '' ? Number.parseFloat(longitudeHeader) : undefined,
  };

  return requestHints;
});
