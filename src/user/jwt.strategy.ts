import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserSession } from './entities/user-session.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'hello-world',
    });
  }

  async validate(payload: any) {
    const user = new UserSession();
    user.id = payload.sub;
    user.fullName = payload.fullName;
    user.email = payload.email;
    user.membership = payload.membership;
    user.roles = payload.roles;
    return user;
  }
}
