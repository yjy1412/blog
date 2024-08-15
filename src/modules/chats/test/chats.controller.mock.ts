import { ChatsService } from '../chats.service';
import { ChatsBaseMock } from './chats.base.mock';

export class ChatsControllerMock extends ChatsBaseMock {
  public readonly mockChatsService: Partial<ChatsService> = {
    createChat: jest.fn(),
    paginateChats: jest.fn(),
  };
}
