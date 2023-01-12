import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './entities/user-session.entity';
//
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const role = this.reflector.getAllAndOverride<Role>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (role) {
      if (!user.roles.includes(role)) {
        throw new ForbiddenException('No permission');
      }
    }

    Reflect.defineMetadata(
      'class_serializer:options',
      { groups: user.roles },
      context.getClass(),
    );

    return true;
  }
}
