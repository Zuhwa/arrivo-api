import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth0Guard } from './auth0.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.decorator';
import { User as UserType } from './entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { JwtAuthGuard } from './jwt.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserResponseDto } from './dto/login-user-response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @UseGuards(Auth0Guard)
  @ApiResponse({ type: LoginUserResponseDto })
  login(@Body() body: LoginUserDto, @User() user: UserSession) {
    return {
      accessToken: this.userService.getAccessToken(user),
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserType })
  findOne(@User() { id }: UserSession) {
    return this.userService.findOne(id);
  }
}
