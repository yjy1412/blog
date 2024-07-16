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

  async createPost(createPostDto: CreatePostDto) {
    const author = await this.usersService.getUserById(createPostDto.authorId);

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

  getPostsAll() {
    return this.postsRepository.find();
  }

  async getPostById(postId: number) {
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

  async updatePostById(postId: number, updatePostDto: UpdatePostDto) {
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

  async deletePostById(postId: number) {
    await this.postsRepository.delete(postId);

    return true;
  }
}
