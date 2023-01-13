import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/user/jwt.guard';
import { Roles } from 'src/user/roles.decorator';
import { Role, UserSession } from 'src/user/entities/user-session.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Post as PostType,
  PostLabel,
  PostStatus,
} from './entities/post.entity';
import { User } from 'src/user/user.decorator';

@ApiTags('post')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiResponse({ type: PostType })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiResponse({ type: [PostType] })
  findAll(@User() { roles, membership }: UserSession) {
    const status = roles.includes(Role.Admin)
      ? [PostStatus.DRAFT, PostStatus.PENDING_REVIEW, PostStatus.PUBLISHED]
      : [PostStatus.PUBLISHED];

    const label = roles.includes(Role.Admin)
      ? [PostLabel.NORMAL, PostLabel.PREMIUM]
      : [PostLabel.NORMAL, membership];

    return this.postService.findAll(status, label);
  }

  @Get(':id')
  @ApiResponse({ type: PostType })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @User() { roles, membership }: UserSession,
  ) {
    const status = roles.includes(Role.Admin)
      ? [PostStatus.DRAFT, PostStatus.PENDING_REVIEW, PostStatus.PUBLISHED]
      : [PostStatus.PUBLISHED];

    const label = !roles.includes(Role.Admin) ? membership : undefined;

    return this.postService.findOne(id, status, label);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiResponse({ type: PostType })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiResponse({ type: PostType })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.remove(id);
  }
}
