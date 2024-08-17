import { config } from 'dotenv';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
import { AuthJwtModule } from './modules/auth-jwt/auth-jwt.module';
import { AuthJwtHttpGuard } from './modules/auth-jwt/guards/auth-jwt.http.guard';
import { CommonModule } from './modules/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_PATH } from './modules/common/constants/path.constant';
import { ChatsModule } from './modules/chats/chats.module';
import { dataSource } from './core/db/data-source.db';

config();
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
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
  ],
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
export class AppModule {}
