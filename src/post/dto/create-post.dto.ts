import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum } from 'class-validator';
import { PostLabel, PostStatus } from '../entities/post.entity';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty()
  @IsEnum(PostLabel)
  label: PostLabel;
}
