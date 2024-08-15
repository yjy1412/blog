import { Server, Socket } from 'socket.io';
import { ChatsSocketEventEnum } from '../enums/chats.socket-event.enum';

export interface ChatsBaseSocketMessage {
  event: ChatsSocketEventEnum;
  message: string;
}

/**
 * [ 주의 ]
 * InRoom과 ToRoom의 차이는 요청 socket에도 메시지를 보낼지에 따라 구분합니다.
 * InRoom은 요청 socket에도 메시지를 보내는 경우, ToRoom은 요청 socket에는 메시지를 보내지 않는 경우입니다.
 */
export interface ChatsSocketMessageFromServerInRoom
  extends ChatsBaseSocketMessage {
  server: Server;
  chatId: number;
}

export interface ChatsSocketMessageFromClientToRoom
  extends ChatsBaseSocketMessage {
  socket: Socket;
  chatId: number;
  senderId: number;
}
