import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatsSocketEventEnum } from './enums/chats.socket-event.enum';
import { ChatsJoinGatewayDto } from './dtos/gateways/chats.join.gateway.dto';
import { ChatsService } from './chats.service';
import { Socket, Server } from 'socket.io';
import { UsersService } from '../users/users.service';
import { ChatsLeaveGatewayDto } from './dtos/gateways/chats.leave.gateway.dto';
import { ChatsSendMessageGatewayDto } from './dtos/gateways/chats.send-message.gateway.dto';
import { AuthJwtService } from '../auth-jwt/auth-jwt.service';
import { BearerTokenHeaderType } from '../auth-jwt/types/auth-jwt.type';
import { UserModel } from '../users/entities/users.entity';

@WebSocketGateway(80, { namespace: 'chats' })
export class ChatsGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    /**
     * 소켓 서버가 처음 시작했을 때 필요한 로직을 작성합니다.
     */
    this.server = server;
  }

  handleConnection(socket: Socket & { user: UserModel }) {
    /**
     * 소켓이 연결되었을 때 필요한 로직을 작성합니다.
     */
    try {
      const accessToken = this.authJwtService.extractTokenFromHeader(
        socket.handshake.headers.authorization as BearerTokenHeaderType,
        true,
      );

      const payload = this.authJwtService.verifyBearerToken(accessToken, false);

      socket.user = payload;

      return true;
    } catch (err) {
      socket.emit(
        ChatsSocketEventEnum.EXCEPTION,
        '인증에 실패했습니다. 재로그인이 필요합니다.',
      );

      socket.disconnect(true);
    }
  }

  @SubscribeMessage(ChatsSocketEventEnum.JOIN_CHAT)
  async joinChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: ChatsJoinGatewayDto,
  ) {
    const joinUser = await this.usersService.getUserById(body.userId);

    await this.chatsService.createUserJoinChat(joinUser, body.chatId);

    socket.join(body.chatId.toString());

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
    const leaveUser = await this.usersService.getUserById(body.userId);

    await this.chatsService.deleteUserLeaveChat(leaveUser, body.chatId);

    socket.leave(body.chatId.toString());

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

    this.chatsService.sendRoomMessageFromSocket({
      socket,
      chatId: body.chatId,
      senderId: body.userId,
      event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
      message: body.message,
    });
  }
}
