import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

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

  async findAll() {
    return await this.postRepo.find({
      relations: ['category'],
    });
  }

  async findOne(id: string) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);
    await this.categoryService.findOne(updatePostDto.categoryId);

    await this.postRepo.update(id, {
      ...post,
      ...updatePostDto,
    });

    return await this.findOne(id);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    return await this.postRepo.remove(post);
  }
}
