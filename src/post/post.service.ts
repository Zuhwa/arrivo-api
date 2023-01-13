import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostLabel, PostStatus } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const category = await this.categoryService.findOne(
      createPostDto.categoryId,
    );

    const post = new Post();
    post.title = createPostDto.title;
    post.body = createPostDto.body;
    post.categoryId = category.id;
    post.status = createPostDto.status;
    post.label = createPostDto.label;

    await this.postRepo.save(post);
    return await this.findOne(post.id);
  }

  async findAll(
    status: PostStatus[] = [PostStatus.PUBLISHED],
    label: PostLabel[] = [PostLabel.NORMAL, PostLabel.PREMIUM],
  ) {
    return await this.postRepo.find({
      where: {
        status: In(status),
        label: In(label),
      },
      relations: ['category'],
    });
  }

  async findOne(
    id: string,
    status: PostStatus[] = [
      PostStatus.PUBLISHED,
      PostStatus.PENDING_REVIEW,
      PostStatus.DRAFT,
    ],
    label?: PostLabel,
  ) {
    const post = await this.postRepo.findOne({
      where: { id, status: In(status), label },
      relations: ['category'],
    });

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);
    await this.categoryService.findOne(updatePostDto.categoryId);

    await this.postRepo.update(id, {
      ...updatePostDto,
    });

    return await this.findOne(id);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    return await this.postRepo.remove(post);
  }
}
