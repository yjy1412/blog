import { AuthJwtService } from '../../auth-jwt/auth-jwt.service';
import { UsersService } from '../../users/users.service';
import { ChatsService } from '../chats.service';
import { ChatsBaseMock } from './chats.base.mock';

export class ChatsGatewayMock extends ChatsBaseMock {
  public readonly mockChatsService: Partial<ChatsService> = {
    createChat: jest.fn(),
    createUserJoinChat: jest.fn(),
    paginateChats: jest.fn(),
    sendRoomMessageFromServer: jest.fn(),
    sendRoomMessageFromSocket: jest.fn(),
    deleteUserLeaveChat: jest.fn(),
  };

  public readonly mockUsersService: Partial<UsersService> = {
    getUserById: jest.fn(),
  };

  public readonly mockAuthJwtService: Partial<AuthJwtService> = {
    extractTokenFromHeader: jest.fn(),
    verifyBearerToken: jest.fn(),
  };
}
