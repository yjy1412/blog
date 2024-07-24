import { PostModel } from '../entities/post.entity';
import { UserModel } from '../../users/entities/user.entity';

export abstract class PostsBaseMock {
  public readonly mockUser: UserModel = {
    id: 1,
    email: 'tester@test.com',
    password: 'testPassword',
    name: {
      first: 'Hong',
      last: 'Gil-Dong',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  };

  public readonly mockPost: PostModel = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 1,
    author: this.mockUser,
  };
}
