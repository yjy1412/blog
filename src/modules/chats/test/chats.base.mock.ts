import { BaseMock } from '../../common/test/base.mock';
import { ChatModel } from '../entities/chats.entity';

export class ChatsBaseMock extends BaseMock {
  public readonly mockSocketServer = {
    in: jest.fn().mockReturnValue({
      emit: jest.fn(),
    }),
  };

  public readonly mockSocket = {
    handshake: {
      headers: {
        authorization: null,
      },
    },
    user: this.mockUser,
    disconnect: jest.fn(),
    emit: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
    to: jest.fn().mockReturnValue({
      emit: jest.fn(),
    }),
  };

  public readonly mockChat: ChatModel = {
    id: 1,
    name: 'test room',
    description: 'test용 채팅방입니다.',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    users: [],
  };
}
