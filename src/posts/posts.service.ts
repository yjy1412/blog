import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';

import { PostModel } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 게시물 생성
   */
  async createPost(
    newPost: Pick<
      PostModel,
      'title' | 'content' | 'likeCount' | 'commentCount' | 'authorId'
    >,
  ): Promise<PostModel> {
    const author = await this.usersService.getUserById(newPost.authorId);

    if (!author) {
      throw new NotFoundException(`User with id ${newPost.authorId} not found`);
    }

    const createdPost = this.postsRepository.create({
      ...newPost,
      author: {
        id: newPost.authorId,
      },
    });

    return this.postsRepository.save(createdPost);
  }

  /**
   * 모든 게시물 조회
   */
  getPostsAll(): Promise<PostModel[]> {
    return this.postsRepository.find();
  }

  /**
   * 게시물 조회
   */
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

  /**
   * 게시물 수정
   */
  async updatePostById(
    postId: number,
    updatePost: Partial<PostModel>,
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
      ...updatePost,
    });
  }

  /**
   * 게시물 삭제
   */
  async deletePostById(postId: number): Promise<boolean> {
    await this.postsRepository.delete(postId);

    return true;
  }
}
