import { BaseMock } from '../../common/test/base.mock';
import { UsersService } from '../users.service';

export class UsersControllerMock extends BaseMock {
  public readonly mockUsersService: Partial<UsersService> = {
    createUser: jest.fn(),
    getUsersAll: jest.fn(),
    getUserById: jest.fn(),
    updateUserById: jest.fn(),
    deleteUserById: jest.fn(),
  };
}
