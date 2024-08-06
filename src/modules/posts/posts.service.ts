import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';

import { PostModel } from './entities/post.entity';
import { PaginatePostsDto } from './dtos/paginate-posts.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationResponse } from '../common/interfaces/pagination.interface';
import { CreatePostDto } from './dtos/create-post.dto';
import { join } from 'path';
import {
  PATH_FROM_PUBLIC_TO_POST_IMAGE,
  PUBLIC_IMAGE_PATH,
  PUBLIC_POST_IMAGE_FOLDER_NAME,
  PUBLIC_TEMP_PATH,
} from '../common/constants/path.constant';
import { promises as fs } from 'fs';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
    private readonly usersService: UsersService,
    private readonly commonService: PaginationService,
  ) {}
  async createPost(authorId: number, dto: CreatePostDto): Promise<PostModel> {
    const author = await this.usersService.getUserById(authorId);

    if (!author) {
      throw new NotFoundException(`User with id ${authorId} not found`);
    }

    const createdPost = this.postsRepository.create({
      ...dto,
      author: {
        id: authorId,
      },
    });

    return this.postsRepository.save(createdPost);
  }

  async paginatePosts(
    query: PaginatePostsDto,
  ): Promise<PaginationResponse<PostModel>> {
    return this.commonService.paginate<PostModel, PaginatePostsDto>(
      query,
      this.postsRepository,
    );
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

  async deletePostById(postId: number): Promise<boolean> {
    await this.postsRepository.delete(postId);

    return true;
  }

  async savePostImages(images: string[]): Promise<string[]> {
    const saveFilePromises = images.map(async (image) => {
      const tempSavedImagePath = join(PUBLIC_TEMP_PATH, image);

      try {
        await fs.access(tempSavedImagePath);
      } catch (error) {
        throw new BadRequestException(`${image} 파일을 찾을 수 없습니다.`);
      }

      await fs.rename(
        tempSavedImagePath,
        join(PUBLIC_IMAGE_PATH, PUBLIC_POST_IMAGE_FOLDER_NAME, image),
      );

      return `/${PATH_FROM_PUBLIC_TO_POST_IMAGE}/${image}`;
    });

    const savedImages = await Promise.all(saveFilePromises);

    return savedImages;
  }

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
