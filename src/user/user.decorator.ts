import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserSession } from './entities/user-session.entity';

export const User = createParamDecorator<UserSession>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
