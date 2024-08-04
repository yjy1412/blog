import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { CustomLoggerService } from '../../modules/common/services/custom-logger.service';
import { Observable, tap } from 'rxjs';

export class HttpRequestResponseLoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    this.loggerService.log(
      `[Request] ${method} ${url}`,
      HttpRequestResponseLoggerInterceptor.name,
      {
        headers: request.headers,
        body: request.body,
      },
    );

    return next.handle().pipe(
      tap((body) =>
        this.loggerService.log(
          `[Reponse] ${method} ${url}`,
          HttpRequestResponseLoggerInterceptor.name,
          {
            body,
          },
        ),
      ),
    );
  }
}
