import { config } from 'dotenv';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsModule } from './modules/posts/posts.module';
import { PostModel } from './modules/posts/entities/post.entity';
import { UsersModule } from './modules/users/users.module';
import { UserModel } from './modules/users/entities/user.entity';
import { AuthJwtModule } from './modules/auth-jwt/auth-jwt.module';
import { AuthJwtGuard } from './modules/auth-jwt/guards/auth-jwt.guard';
import { CommonModule } from './modules/common/common.module';
import { ConfigModule } from '@nestjs/config';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from './modules/common/constants/env-keys.constant';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_PATH } from './modules/common/constants/path.constant';
import { ChatsModule } from './modules/chats/chats.module';
import { ChatModel } from './modules/chats/entities/chat.entity';

config();
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [PostModel, UserModel, ChatModel],
      synchronize: true,
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
      useClass: AuthJwtGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
