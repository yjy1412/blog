import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class HttpResponseFormatterInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    /**
     * 에러 발생으로 Exception Filter를 타는 경우, 이곳은 실행되지 않습니다.
     */
    return next.handle().pipe(map((data) => ({ isSuccess: true, data })));
  }
}
