import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomLoggerService } from '../../modules/common/services/custom-logger.service';

@Catch(Error, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(public readonly customLoggerService: CustomLoggerService) {}

  public readonly internalServerErrorResponse = {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message:
      '서버 장애가 발생했습니다. 장애가 지속되는 경우 관리자에게 문의해주세요.',
    error: 'Internal Server Error',
  };

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;

    let status: HttpStatus;
    let errorResponse: string | object;

    if (
      isHttpException &&
      exception.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      status = exception.getStatus();
      errorResponse = exception.getResponse();
    } else {
      this.customLoggerService.error(
        exception.message,
        HttpExceptionFilter.name,
        exception.stack,
      );

      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = this.internalServerErrorResponse;
    }

    response.status(status).json(errorResponse);
  }
}
