import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLabel } from 'src/post/entities/post.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSession } from './entities/user-session.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findOrCreateUser(name: string, email: string) {
    let user = await this.userRepo.findOne({ where: { email } });
    if (user) return user;

    user = new User();
    user.fullName = name;
    user.email = email;
    user.membership = PostLabel.NORMAL;
    return await this.userRepo.save(user);
  }

  getAccessToken(userSession: UserSession) {
    return this.jwtService.sign(
      {
        sub: userSession.id,
        fullName: userSession.fullName,
        email: userSession.email,
        membership: userSession.membership,
        roles: userSession.roles,
      },
      {
        expiresIn: '1d',
      },
    );
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);
    await this.userRepo.update(id, {
      ...user,
      ...updateUserDto,
    });
    return this.findOne(id);
  }
}
