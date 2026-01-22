import type { ExecutionContext } from '@nestjs/common';
import type { RequestUser } from '../dto/request-user.dto';
import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as RequestUser;
});
