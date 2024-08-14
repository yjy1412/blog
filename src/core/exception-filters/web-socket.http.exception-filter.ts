import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CustomLoggerService } from '../../modules/common/services/custom-logger.service';
import { ChatsSocketEventEnum } from '../../modules/chats/enums/chats.socket-event.enum';

@Injectable()
@Catch(HttpException)
export class WebSocketHttpExceptionFilter implements ExceptionFilter {
  /**
   * [ 주의 ]
   * HttpExceptionFilter와 동일한 응답형식을 갖추고 있습니다.
   * 수정 시 관련하여 같이 확인이 필요합니다.
   *
   * 해당 프로젝트는 모든 Exception을 HttpException으로 처리하고 해당 필터를 통해 exception 메시지를 전달합니다.
   * 그렇게 한 의도는, 서비스 로직에서 처리하는 Exception을 동일하게 하여 프로젝트의 복잡성을 줄이기 위함 입니다.
   */
  constructor(private readonly customLoggerService: CustomLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient();

    const status = exception.getStatus();

    if (status === 500) {
      this.customLoggerService.error(
        exception.message,
        WebSocketHttpExceptionFilter.name,
        exception.stack,
      );

      socket.emit(ChatsSocketEventEnum.EXCEPTION, {
        statusCode: status,
        message:
          '서버 장애가 발생했습니다. 장애가 지속되는 경우 관리자에게 문의해주세요.',
        error: exception.name,
      });
    } else {
      socket.emit(ChatsSocketEventEnum.EXCEPTION, exception.getResponse());
    }
  }
}
