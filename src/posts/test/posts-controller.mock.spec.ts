import { Injectable } from '@nestjs/common';

import { UserModel } from '../../users/entities/user.entity';
import { PostsService } from '../posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { BaseMock } from '../../common/test/base.mock.spec';

@Injectable()
export class PostsControllerMock extends BaseMock {
  public readonly mockCreatePostInfo: CreatePostDto = {
    title: this.mockPost.title,
    content: this.mockPost.content,
    likeCount: this.mockPost.likeCount,
    commentCount: this.mockPost.commentCount,
  };

  public readonly mockUpadatePostInfo: UpdatePostDto = {
    title: 'Test Update Post',
    content: 'Test Update Content',
  };

  public readonly mockAuthenticatedUser: Pick<UserModel, 'id' | 'email'> = {
    id: this.mockUser.id,
    email: this.mockUser.email,
  };

  public readonly mockPostsService: Partial<PostsService> = {
    createPost: jest.fn().mockResolvedValue(this.mockPost),
    getPostsAll: jest.fn().mockResolvedValue([this.mockPost]),
    getPostById: jest.fn().mockResolvedValue(this.mockPost),
    updatePostById: jest.fn().mockResolvedValue(this.mockPost),
    deletePostById: jest.fn().mockResolvedValue(true),
  };
}
