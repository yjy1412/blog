import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
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
  await app.listen(3000);
}
bootstrap();
