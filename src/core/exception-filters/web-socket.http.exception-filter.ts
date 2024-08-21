import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CustomLoggerService } from '../../modules/common/services/custom-logger.service';
import { SocketEventEnum } from '../../modules/common/enums/socket-event.enum';
import { HttpExceptionFilter } from './http.exception-filter';

@Injectable()
@Catch(Error, HttpException)
export class WebSocketHttpExceptionFilter extends HttpExceptionFilter {
  /**
   * [ 주의 ]
   * HttpExceptionFilter와 동일한 응답형식을 갖추고 있습니다.
   * 수정 시 관련하여 같이 확인이 필요합니다.
   *
   * 해당 프로젝트는 모든 Exception을 HttpException으로 처리하고 해당 필터를 통해 exception 메시지를 전달합니다.
   * 그렇게 한 의도는, 서비스 로직에서 처리하는 Exception을 동일하게 하여 프로젝트의 복잡성을 줄이기 위함 입니다.
   */
  constructor(public readonly customLoggerService: CustomLoggerService) {
    super(customLoggerService);
  }

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient();
    const isHttpException = exception instanceof HttpException;

    let errorResponse: string | object;

    if (
      isHttpException &&
      exception.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      errorResponse = exception.getResponse();
    } else {
      this.customLoggerService.error(
        exception.message,
        WebSocketHttpExceptionFilter.name,
        exception.stack,
      );

      errorResponse = this.internalServerErrorResponse;
    }

    socket.emit(SocketEventEnum.EXCEPTION, errorResponse);
  }
}
