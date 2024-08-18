import { PostModel } from '../../posts/entities/posts.entity';
import { UserModel } from '../../users/entities/users.entity';
import * as bcrypt from 'bcrypt';

export abstract class BaseMock {
  constructor() {}
  public readonly mockUserRegistrationInfo: Pick<
    UserModel,
    'email' | 'password' | 'name'
  > = {
    email: 'test@test.com',
    password: 'testPassword12!',
    name: '양진영',
  };

  public readonly mockUser: UserModel = {
    ...this.mockUserRegistrationInfo,
    id: 1,
    password: bcrypt.hashSync(this.mockUserRegistrationInfo.password, 10),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  public readonly mockPost: PostModel = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    authorId: 1,
  };
}
