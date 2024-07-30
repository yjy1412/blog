import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';

import { PostModel } from './entities/post.entity';
import { GetPostsQueryDto } from './dtos/get-posts-query.dto';
import { CommonService } from '../common/common.service';
import { Pagination } from '../common/interfaces/pagination.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
    private readonly usersService: UsersService,
    private readonly commonService: CommonService,
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
  async getPosts(query: GetPostsQueryDto): Promise<Pagination<PostModel>> {
    const path = 'posts';

    return this.commonService.cursorPaginate<PostModel>(
      path,
      query,
      this.postsRepository,
    );
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

  /**
   * [ 테스트용 ] 랜덤 게시글 생성
   */
  async createRandomPosts(howMany: number): Promise<boolean> {
    const randomPosts = [];

    for (let i = 0; i < howMany; i++) {
      randomPosts.push({
        title: `Test Post ${i}`,
        content: `Test Content ${i}`,
        likeCount: Math.floor(Math.random() * howMany),
        commentCount: Math.floor(Math.random() * howMany),
        authorId: 1,
      });
    }

    const randomPostsEntities = this.postsRepository.create(randomPosts);

    await this.postsRepository.save(randomPostsEntities);

    return true;
  }
}
