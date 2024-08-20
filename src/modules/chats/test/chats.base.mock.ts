import { BaseMock } from '../../common/test/base.mock';
import { ChatModel } from '../entities/chats.entity';

export class ChatsBaseMock extends BaseMock {
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
