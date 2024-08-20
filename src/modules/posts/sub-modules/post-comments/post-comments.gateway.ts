import { UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocketHttpExceptionFilter } from '../../../../core/exception-filters/web-socket.http.exception-filter';
import { PostCommentsService } from './post-comments.service';
import { Server, Socket } from 'socket.io';
import { AuthJwtService } from '../../../auth-jwt/auth-jwt.service';
import { PostCommentsSocketEventEnum } from './enums/post-comments.socket-event.enum';
import { PostCommentsSocketMessageSenderEnum } from './enums/post-comments.socket-message-sender.enum';
import { SocketEventEnum } from '../../../common/enums/socket-event.enum';

@WebSocketGateway(80, { namespace: 'post-comments' })
@UseFilters(WebSocketHttpExceptionFilter)
export class PostCommentsGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    private readonly postCommentsService: PostCommentsService,
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
      await this.authJwtService.authorizeUserForSocket(socket);
    } catch (error) {
      socket.emit(
        SocketEventEnum.EXCEPTION,
        '인증에 실패했습니다. 재로그인이 필요합니다.',
      );

      socket.disconnect(true);
    }
  }

  sendMessageForPostCommentCreated(postId: number, commentId: number) {
    this.server.emit(PostCommentsSocketEventEnum.CREATE_COMMENT, {
      from: PostCommentsSocketMessageSenderEnum.SYSTEM,
      message: {
        postId,
        commentId,
      },
    });
  }

  sendMessageForPostCommentDeleted(postId: number, commentId: number) {
    this.server.emit(PostCommentsSocketEventEnum.DELETE_COMMENT, {
      from: PostCommentsSocketMessageSenderEnum.SYSTEM,
      message: {
        postId,
        commentId,
      },
    });
  }
}
