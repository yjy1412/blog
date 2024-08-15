import { AuthJwtService } from '../../auth-jwt/auth-jwt.service';
import { PaginationService } from '../../common/services/pagination.service';
import { UsersService } from '../../users/users.service';
import { ChatsBaseMock } from './chats.base.mock';

export class ChatsServiceMock extends ChatsBaseMock {
  public readonly mockPaginationService: Partial<PaginationService> = {
    paginate: jest.fn(),
  };

  public readonly mockUsersService: Partial<UsersService> = {
    getUserById: jest.fn(),
  };

  public readonly mockAuthJwtService: Partial<AuthJwtService> = {};
}
