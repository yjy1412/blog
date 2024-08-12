import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CustomLoggerService } from '../common/services/custom-logger.service';
import { ChatsSocketEventEnum } from './enums/chats.socket-event.enum';
import { ChatsJoinGatewayDto } from './dtos/gateways/chats.join.gateway.dto';
import { ChatsService } from './chats.service';
import { Socket, Server } from 'socket.io';
import { UsersService } from '../users/users.service';
import { ChatsLeaveGatewayDto } from './dtos/gateways/chats.leave.gateway.dto';
import { ChatsSendMessageGatewayDto } from './dtos/gateways/chats.send-message.gateway.dto';

@WebSocketGateway(80, { namespace: 'chats' })
export class ChatsGateway {
  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(ChatsSocketEventEnum.JOIN_CHAT)
  async joinChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: ChatsJoinGatewayDto,
  ) {
    const roomId = body.chatId.toString();

    const joinUser = await this.usersService.getUserById(body.userId);

    await this.chatsService.createUserJoinChat(joinUser, body.chatId);

    socket.join(roomId);

    this.chatsService.sendRoomMessageFromServer({
      server: this.server,
      chatId: body.chatId,
      event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
      message: `[${joinUser.name}] 님이 채팅방에 입장하셨습니다.`,
    });
  }

  @SubscribeMessage(ChatsSocketEventEnum.LEAVE_CHAT)
  async leaveChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: ChatsLeaveGatewayDto,
  ) {
    const roomId = body.chatId.toString();

    const leaveUser = await this.usersService.getUserById(body.userId);

    await this.chatsService.deleteUserLeaveChat(leaveUser, body.chatId);

    socket.leave(roomId);

    this.chatsService.sendRoomMessageFromServer({
      server: this.server,
      chatId: body.chatId,
      event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
      message: `[${leaveUser.name}] 님이 채팅방에서 퇴장하셨습니다.`,
    });
  }

  @SubscribeMessage(ChatsSocketEventEnum.SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: ChatsSendMessageGatewayDto,
  ) {
    await this.chatsService.checkIsChatExist(body.chatId);

    await this.chatsService.checkIsUserInChat(body.userId, body.chatId);

    await this.chatsService.checkIsUserInChat(body.userId, body.chatId);
    this.chatsService.sendRoomMessageFromSocket({
      socket,
      chatId: body.chatId,
      senderId: body.userId,
      event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
      message: body.message,
    });
  }
}
