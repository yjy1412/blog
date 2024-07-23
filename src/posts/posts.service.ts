import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';

import { UpdatePostDto } from './dtos/update-post.dto';
import { PostModel } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
    private readonly usersService: UsersService,
  ) {}

  async createPost(
    post: Pick<
      PostModel,
      'title' | 'content' | 'likeCount' | 'commentCount' | 'authorId'
    >,
  ): Promise<PostModel> {
    const author = await this.usersService.getUserById(post.authorId);

    if (!author) {
      throw new NotFoundException(`User with id ${post.authorId} not found`);
    }

    const createdPost = this.postsRepository.create({
      ...post,
      author: {
        id: post.authorId,
      },
    });

    return this.postsRepository.save(createdPost);
  }

  getPostsAll(): Promise<PostModel[]> {
    return this.postsRepository.find();
  }

  async getPostById(postId: number): Promise<PostModel> {
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

  async updatePostById(
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<PostModel> {
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

  async deletePostById(postId: number): Promise<boolean> {
    await this.postsRepository.delete(postId);

    return true;
  }
}
