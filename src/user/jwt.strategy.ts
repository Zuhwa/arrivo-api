import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UserSession } from './entities/user-session.entity';
import { UserService } from './user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserService) private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'c12d3558-5d33-44c7-9d9e-0e6771e82fb9',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.sub);

    const userSession = new UserSession();
    userSession.id = payload.sub;
    userSession.fullName = payload.fullName;
    userSession.email = payload.email;
    userSession.membership = user.membership;
    userSession.roles = payload.roles;
    return userSession;
  }
}
