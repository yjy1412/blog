import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { CommonModule } from '../common/common.module';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModel } from './entities/chats.entity';
import { UsersModule } from '../users/users.module';
import { AuthJwtModule } from '../auth-jwt/auth-jwt.module';
import { WebSocketHttpExceptionFilter } from '../../core/exception-filters/web-socket.http.exception-filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatModel]),
    CommonModule,
    UsersModule,
    AuthJwtModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsGateway, ChatsService, WebSocketHttpExceptionFilter],
})
export class ChatsModule {}
