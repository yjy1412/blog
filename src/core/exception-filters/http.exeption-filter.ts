import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomLoggerService } from '../../modules/common/services/custom-logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly customLoggerService: CustomLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === 500) {
      /**
       * 1. 에러 로깅
       * 2. 에러 메시지 변환
       */
      this.customLoggerService.error(
        exception.message,
        HttpExceptionFilter.name,
        exception.stack,
      );

      response.status(status).json({
        statusCode: status,
        message:
          '서버 장애가 발생했습니다. 장애가 지속되는 경우 관리자에게 문의해주세요.',
        error: exception.name,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        error: exception.name,
      });
    }
  }
}
