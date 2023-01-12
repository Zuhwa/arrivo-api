import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { PostLabel } from 'src/post/entities/post.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(PostLabel)
  membership: PostLabel;
}
