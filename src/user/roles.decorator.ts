import { SetMetadata } from '@nestjs/common';
import { Role } from './entities/user-session.entity';

export const Roles = (role: Role) => SetMetadata('role', role);
