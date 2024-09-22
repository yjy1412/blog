import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './modules/common/services/custom-logger.service';
import { HttpRequestResponseLoggerInterceptor } from './core/interceptors/http-reqeust-response-logger.interceptor';
import { HttpExceptionFilter } from './core/exception-filters/http.exception-filter';
import { HttpResponseFormatterInterceptor } from './core/interceptors/http-response-formatter.interceptor';
import { ENV_APP_PORT_KEY } from './modules/common/constants/env-keys.constant';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    /**
     * [Official] make sure all logs will be buffered until a custom logger is attached
     * and the application initialisation process either completes or fails
     *
     * 커스텀 로거가 연결될 때까지 모든 로그가 버퍼링되도록 보장합니다.
     */
    bufferLogs: true,
  });

  const customLoggerService = app.get(CustomLoggerService);

  app.useLogger(customLoggerService);

  app.useGlobalInterceptors(
    /**
     * next 핸들러를 타는 경우, 인터셉터의 순서는 아래와 같이 진행됩니다.
     * ex) 1번, 2번 글로벌 인터셉터가 순서대로 설정되어 있는 경우
     * 1 -> 2 -> next -> 2 -> 1 순으로 실행됩니다.
     */
    new HttpRequestResponseLoggerInterceptor(customLoggerService),
    new HttpResponseFormatterInterceptor(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * If set to true validator will strip validated object of any properties that do not have any decorators.
       *
       * DTO에 모든 속성이 optional로 설정되어 있는 경우, forbidNonWhitelisted 기능이 제대로 되지 않고 있음
       * forbidNonWhitelisted를 보완하는 기능으로 사용
       */
      whitelist: true,
      /**
       * If set to true, instead of stripping non-whitelisted properties validator will throw an error
       *
       * DTO에 정의되지 않은 속성이 포함된 요청을 거부할지 여부
       */
      forbidNonWhitelisted: true,
      /**
       * 직렬화 / 역직렬화 시, 데이터 변경을 허용할 지 여부
       *
       * true로 설정한 경우, DTO를 통한 데이터 변경을 허용합니다.
       * 일반적으로, DTO에서 default value를 설정한 경우 이를 반영하기 위해 사용합니다.
       */
      transform: true,
      /**
       * transform 옵션
       *
       * 데이터 변경에 필요한 추가옵션을 설정할 수 있습니다.
       */
      transformOptions: {
        /**
         * If set to true class-transformer will attempt conversion based on TS reflected type
         *
         * true로 설정한 경우, 변환 전 데이터를 DTO에 정의된 타입으로 변경할 수 있는 경우 변경하여 변환합니다.
         * 이는, DTO 개별로도 적용할 수 있습니다. ex) @Type(() => Number)
         */
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(customLoggerService));

  await app.listen(process.env[ENV_APP_PORT_KEY]);

  customLoggerService.log(
    `Application is running on: ${await app.getUrl()}`,
    'Bootstrap',
  );
}
bootstrap();
