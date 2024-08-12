import { Server, Socket } from 'socket.io';
import { ChatsSocketEventEnum } from '../enums/chats.socket-event.enum';

export interface ChatsBaseSendMessageInterface {
  event: ChatsSocketEventEnum;
  message: string;
}

export interface ChatsSendRoomMessageFromServerInterface
  extends ChatsBaseSendMessageInterface {
  server: Server;
  chatId: number;
}

export interface ChatsSendRoomMessageFromSocketInterface
  extends ChatsBaseSendMessageInterface {
  socket: Socket;
  chatId: number;
  senderId: number;
}
