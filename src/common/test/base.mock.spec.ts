import { UserModel } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export abstract class BaseMock {
  constructor() {}
  public readonly mockUserRegistrationInfo: Pick<
    UserModel,
    'email' | 'password' | 'name'
  > = {
    email: 'test@test.com',
    password: 'testPassword',
    name: {
      first: 'Hong',
      last: 'Gil-Dong',
    },
  };

  public readonly mockUser: UserModel = {
    ...this.mockUserRegistrationInfo,
    id: 1,
    password: bcrypt.hashSync(this.mockUserRegistrationInfo.password, 10),
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  };
}
