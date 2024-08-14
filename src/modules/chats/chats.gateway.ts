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
import { UseFilters } from '@nestjs/common';
import { WebSocketHttpExceptionFilter } from '../../core/exception-filters/web-socket.http.exception-filter';
import { SocketEventEnum } from '../common/enums/socket-event.enum';

@WebSocketGateway(80, { namespace: 'chats' })
@UseFilters(WebSocketHttpExceptionFilter)
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

  async handleConnection(socket: Socket & { user: any }) {
    /**
     * 소켓이 연결되었을 때 필요한 로직을 작성합니다.
     */
    try {
      const accessToken = this.authJwtService.extractTokenFromHeader(
        socket.handshake.headers.authorization as BearerTokenHeaderType,
        true,
      );

      const payload = this.authJwtService.verifyBearerToken(accessToken, false);

      const user = await this.usersService.getUserById(payload.id);

      socket.user = user;

      return true;
    } catch (err) {
      socket.emit(
        SocketEventEnum.EXCEPTION,
        '인증에 실패했습니다. 재로그인이 필요합니다.',
      );

      socket.disconnect(true);
    }
  }

  @SubscribeMessage(ChatsSocketEventEnum.JOIN_CHAT)
  async joinChat(
    @ConnectedSocket() socket: Socket & { user: UserModel },
    @MessageBody() body: ChatsJoinGatewayDto,
  ) {
    await this.chatsService.createUserJoinChat(socket.user, body.chatId);

    socket.join(body.chatId.toString());

    this.chatsService.sendRoomMessageFromServer({
      server: this.server,
      chatId: body.chatId,
      event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
      message: `[${socket.user.name}] 님이 채팅방에 입장하셨습니다.`,
    });
  }

  @SubscribeMessage(ChatsSocketEventEnum.LEAVE_CHAT)
  async leaveChat(
    @ConnectedSocket() socket: Socket & { user: UserModel },
    @MessageBody() body: ChatsLeaveGatewayDto,
  ) {
    await this.chatsService.deleteUserLeaveChat(socket.user, body.chatId);

    socket.leave(body.chatId.toString());

    this.chatsService.sendRoomMessageFromServer({
      server: this.server,
      chatId: body.chatId,
      event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
      message: `[${socket.user.name}] 님이 채팅방에서 퇴장하셨습니다.`,
    });
  }

  @SubscribeMessage(ChatsSocketEventEnum.SEND_MESSAGE)
  async sendMessage(
    @ConnectedSocket() socket: Socket & { user: UserModel },
    @MessageBody() body: ChatsSendMessageGatewayDto,
  ) {
    await this.chatsService.sendRoomMessageFromSocket({
      socket,
      chatId: body.chatId,
      senderId: socket.user.id,
      event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
      message: body.message,
    });
  }
}
