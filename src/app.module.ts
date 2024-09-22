import {
  ClassSerializerInterceptor,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
import { AuthJwtModule } from './modules/auth-jwt/auth-jwt.module';
import { AuthJwtHttpGuard } from './modules/auth-jwt/guards/auth-jwt.http.guard';
import { CommonModule } from './modules/common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_PATH } from './modules/common/constants/path.constant';
import { ChatsModule } from './modules/chats/chats.module';
import { dataSource } from './core/db/data-source.db';
import { CustomLoggerService } from './modules/common/services/custom-logger.service';
import { generateSeed } from './core/db/generate-seed.db';
import { HealthModule } from './modules/health/health.module';
import { AppController } from './app.controller';
import { ENV_NODE_ENV_KEY } from './modules/common/constants/env-keys.constant';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSource.options,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_PATH,
      serveRoot: '/public',
    }),
    PostsModule,
    UsersModule,
    AuthJwtModule,
    CommonModule,
    ChatsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthJwtHttpGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  async onModuleInit() {
    const isProduction =
      this.configService.get(ENV_NODE_ENV_KEY) === 'production';

    if (!isProduction) {
      await generateSeed(this.customLoggerService);
    }
  }
}
