import { Injectable } from '@nestjs/common';

import { UserModel } from '../../users/entities/user.entity';
import { PostsService } from '../posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostsBaseMock } from './posts-base.mock.spec';

@Injectable()
export class PostsControllerMock extends PostsBaseMock {
  public readonly mockCreatePostDto: CreatePostDto = {
    title: 'Test Post',
    content: 'Test Content',
    likeCount: 0,
    commentCount: 0,
  };

  public readonly mockUpadatePostDto: UpdatePostDto = {
    title: 'Test Update Post',
    content: 'Test Update Content',
  };

  public readonly mockAuthenticatedUser: Pick<UserModel, 'id' | 'email'> = {
    id: 1,
    email: 'tester@test.com',
  };

  public readonly mockPostsService: Partial<PostsService> = {
    createPost: jest.fn().mockResolvedValue(this.mockPost),
    getPostsAll: jest.fn().mockResolvedValue([this.mockPost]),
    getPostById: jest.fn().mockResolvedValue(this.mockPost),
    updatePostById: jest.fn().mockResolvedValue(this.mockPost),
    deletePostById: jest.fn().mockResolvedValue(true),
  };
}
