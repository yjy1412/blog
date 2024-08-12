import { Injectable } from '@nestjs/common';

import { UserModel } from '../../users/entities/user.entity';
import { PostsService } from '../posts.service';
import { PostsCreatePostDto } from '../dtos/posts.create-post.dto';
import { PostsUpdatePostDto } from '../dtos/posts.update-post.dto';
import { BaseMock } from '../../common/test/base.mock';

@Injectable()
export class PostsControllerMock extends BaseMock {
  public readonly mockCreatePostInfo: PostsCreatePostDto = {
    title: this.mockPost.title,
    content: this.mockPost.content,
    likeCount: this.mockPost.likeCount,
    commentCount: this.mockPost.commentCount,
  };

  public readonly mockUpadatePostInfo: PostsUpdatePostDto = {
    title: 'Test Update Post',
    content: 'Test Update Content',
  };

  public readonly mockAuthenticatedUser: Pick<UserModel, 'id' | 'email'> = {
    id: this.mockUser.id,
    email: this.mockUser.email,
  };

  public readonly mockPostsService: Partial<PostsService> = {
    createPost: jest.fn().mockResolvedValue(this.mockPost),
    paginatePosts: jest.fn().mockResolvedValue({
      data: [this.mockPost],
      page: {
        currentPage: 1,
        totalCount: 1,
      },
    }),
    getPostById: jest.fn().mockResolvedValue(this.mockPost),
    updatePostById: jest.fn().mockResolvedValue(this.mockPost),
    deletePostById: jest.fn().mockResolvedValue(true),
    savePostImages: jest.fn().mockResolvedValue([]),
  };
}
