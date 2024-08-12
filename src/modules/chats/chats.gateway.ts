import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CustomLoggerService } from '../common/services/custom-logger.service';
import { SocketEventEnum } from './enums/socket-event.enum';
import { JoinChatDto } from './dtos/join-chat.dto';
import { ChatsService } from './chats.service';
import { Socket, Server } from 'socket.io';
import { UsersService } from '../users/users.service';
import { LeaveChatDto } from './dtos/leave-chat.dto';
import { SocketMessageSenderEnum } from './enums/socket-message-sender.enum';
import { SendMessageDto } from './dtos/send-message.dto';

@WebSocketGateway(80, { namespace: 'chats' })
export class ChatsGateway {
  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(SocketEventEnum.JOIN_CHAT)
  async joinChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: JoinChatDto,
  ) {
    const roomId = body.chatId.toString();

    socket.join(roomId);

    const joinUser = await this.usersService.getUserById(body.userId);

    await this.chatsService.createUserJoinChat(joinUser, body.chatId);

    /**
     * 주의: socket.in().emit()는 server.in().emit()와 다릅니다.
     * server.in()는 해당 룸에 연결된 모든 소켓에 메시지를 보내지만, socket.in()는 대상이 되는 소켓을 제외합니다.
     */
    this.server.in(roomId).emit(SocketEventEnum.RECEIVE_MESSAGE, {
      from: SocketMessageSenderEnum.SYSTEM,
      message: `[${joinUser.name}] 님이 채팅방에 입장하셨습니다.`,
    });
  }

  @SubscribeMessage(SocketEventEnum.LEAVE_CHAT)
  async leaveChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: LeaveChatDto,
  ) {
    const roomId = body.chatId.toString();

    socket.leave(roomId);

    const leaveUser = await this.usersService.getUserById(body.userId);

    await this.chatsService.deleteUserLeaveChat(leaveUser, body.chatId);

    /**
     * 주의: socket.in().emit()는 server.in().emit()와 다릅니다.
     * server.in()는 해당 룸에 연결된 모든 소켓에 메시지를 보내지만, socket.in()는 대상이 되는 소켓을 제외합니다.
     */
    this.server.in(roomId).emit(SocketEventEnum.RECEIVE_MESSAGE, {
      from: SocketMessageSenderEnum.SYSTEM,
      message: `[${leaveUser.name}] 님이 채팅방을 나가셨습니다.`,
    });
  }

  @SubscribeMessage(SocketEventEnum.SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: SendMessageDto,
  ) {
    socket.to(body.chatId.toString()).emit(SocketEventEnum.RECEIVE_MESSAGE, {
      from: body.senderId,
      message: body.message,
    });
  }
}
