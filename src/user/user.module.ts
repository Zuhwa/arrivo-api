import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'c12d3558-5d33-44c7-9d9e-0e6771e82fb9',
    }),
  ],
  controllers: [UserController],
  providers: [JwtStrategy, UserService],
  exports: [UserService],
})
export class UserModule {}
