import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';

import { PostModel } from './entities/posts.entity';
import { PostsPaginatePostsDto } from './dtos/posts.paginate-posts.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationResponse } from '../common/interfaces/pagination.interface';
import { PostsCreatePostDto } from './dtos/posts.create-post.dto';
import { join } from 'path';
import {
  PATH_FROM_PUBLIC_TO_POST_IMAGE,
  PUBLIC_POST_IMAGE_PATH,
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

  async createPost(
    authorId: number,
    newPost: PostsCreatePostDto,
  ): Promise<PostModel> {
    const author = await this.usersService.getUserById(authorId);

    if (!author) {
      throw new NotFoundException(`User with id ${authorId} not found`);
    }

    const createdPost = this.postsRepository.create({
      ...newPost,
      author: {
        id: authorId,
      },
    });

    return this.postsRepository.save(createdPost);
  }

  async paginatePosts(
    paginateQuery: PostsPaginatePostsDto,
  ): Promise<PaginationResponse<PostModel>> {
    return this.commonService.paginate<PostModel, PostsPaginatePostsDto>(
      paginateQuery,
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
      await this.isImageUploaded(image);

      await this.moveUploadImageToSaveStorage(image);

      return `/${PATH_FROM_PUBLIC_TO_POST_IMAGE}/${image}`;
    });

    const savedImages = await Promise.all(saveFilePromises);

    return savedImages;
  }

  private async isImageUploaded(image: string): Promise<void> {
    try {
      /**
       * 업로드 이미지는 임시로 'public/temp' 폴더에 저장됩니다.
       */
      const uploadedImagePath = join(PUBLIC_TEMP_PATH, image);

      await fs.access(uploadedImagePath);
    } catch (error) {
      throw new BadRequestException(`${image} 파일을 찾을 수 없습니다.`);
    }
  }

  private async moveUploadImageToSaveStorage(image: string): Promise<void> {
    try {
      const uploadedImagePath = join(PUBLIC_TEMP_PATH, image);
      const postImageSavePath = join(PUBLIC_POST_IMAGE_PATH, image);

      await fs.rename(uploadedImagePath, postImageSavePath);
    } catch (err) {
      throw new InternalServerErrorException(
        `${image} 파일을 저장하는데 실패했습니다.`,
      );
    }
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
