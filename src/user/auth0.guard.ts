import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import axios from 'axios';
import { PostLabel } from 'src/post/entities/post.entity';
import { Role, UserSession } from './entities/user-session.entity';
import { UserService } from './user.service';

interface Auth0UserInfo {
  sub: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: Date;
  email: string;
  email_verified: boolean;
}

interface Auth0ManagementToken {
  access_token: string;
}

interface Auth0Role {
  id: string;
  name: string;
  description: string;
}

export class Auth0Guard implements CanActivate {
  constructor(@Inject(UserService) private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { token } = request.body;

      const userInfo = await this.getUserInfo(token);
      const roles = await this.getUserRoles(userInfo.sub);

      const user = await this.userService.findOrCreateUser(
        userInfo.nickname,
        userInfo.email,
      );

      const userSession = new UserSession();
      userSession.id = user.id;
      userSession.fullName = user.fullName;
      userSession.email = user.email;
      userSession.membership = user.membership;
      userSession.roles = roles.map((x) => x.name as Role);

      request.user = userSession;

      Reflect.defineMetadata(
        'class_serializer:options',
        { groups: userSession.roles },
        context.getClass(),
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async getUserInfo(accessToken: string): Promise<Auth0UserInfo> {
    const { data: userInfo } = await axios.get<Auth0UserInfo>(
      'https://dev-trv811e3dq6xv1zm.us.auth0.com/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return userInfo;
  }

  async getAuth0ManagementToken(): Promise<string> {
    const { data: response } = await axios.post<Auth0ManagementToken>(
      'https://dev-trv811e3dq6xv1zm.us.auth0.com/oauth/token',
      {
        client_id: 'Ueb3KKiebV1t3ztIf4sZaLJDcbwDroTK',
        client_secret:
          'aJer59rFYGLtL6m6TpwgCPTRarDQAmDGm4a4oUVanD14nWoYsUoRbFpxHvIIyMT1',
        audience: 'https://dev-trv811e3dq6xv1zm.us.auth0.com/api/v2/',
        grant_type: 'client_credentials',
      },
    );

    return response.access_token;
  }

  async getUserRoles(userId: string): Promise<Auth0Role[]> {
    const accessToken = await this.getAuth0ManagementToken();

    const { data: roles } = await axios.get<Auth0Role[]>(
      `https://dev-trv811e3dq6xv1zm.us.auth0.com/api/v2/users/${userId}/roles`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return roles;
  }
}
