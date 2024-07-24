import { Injectable } from '@nestjs/common';

import { PostModel } from '../entities/post.entity';
import { PostsBaseMock } from './posts-base.mock.spec';

@Injectable()
export class PostsServiceMock extends PostsBaseMock {
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
}
