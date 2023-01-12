import { PostLabel } from 'src/post/entities/post.entity';

export enum Role {
  Admin = 'Admin',
}

export class UserSession {
  id: string;
  email: string;
  fullName: string;
  roles: Role[];
  membership: PostLabel;
}
