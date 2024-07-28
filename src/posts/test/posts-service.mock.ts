import { Injectable } from '@nestjs/common';

import { PostModel } from '../entities/post.entity';
import { BaseMock } from '../../common/test/base.mock';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PostsServiceMock extends BaseMock {
  public readonly mockNewPost: Pick<
    PostModel,
    'title' | 'content' | 'likeCount' | 'commentCount' | 'authorId'
  > = {
    title: 'Test Post',
    content: 'Test Content',
    likeCount: 0,
    commentCount: 0,
    authorId: 1,
  };

  public readonly mockUpdatePost: Partial<PostModel> = {
    title: 'Test Update Post',
    content: 'Test Update Content',
  };

  public readonly mockUsersService: Partial<UsersService> = {
    getUserById: jest.fn().mockResolvedValue(this.mockUser),
  };
}
