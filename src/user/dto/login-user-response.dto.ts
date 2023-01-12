import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserResponseDto {
  @ApiProperty()
  @IsString()
  accessToken: string;
}
