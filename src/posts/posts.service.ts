import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostModel } from './entities/post.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const author = await this.usersService.findOne(createPostDto.authorId);

    if (!author) {
      throw new NotFoundException(
        `User with id ${createPostDto.authorId} not found`,
      );
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author: {
        id: createPostDto.authorId,
      },
    });

    return this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find();
  }

  async findOne(postId: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    return post;
  }

  async update(postId: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    return this.postsRepository.save({
      ...post,
      ...updatePostDto,
    });
  }

  remove(postId: number) {
    return this.postsRepository.delete(postId);
  }
}
