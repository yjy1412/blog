import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatModel } from './entities/chats.entity';
import { Repository } from 'typeorm';
import { ChatsCreateChatDto } from './dtos/chats.create-chat.dto';
import { PaginationService } from '../common/services/pagination.service';
import { ChatsPaginateChatsDto } from './dtos/chats.paginate-chats.dto';
import { PaginationResponse } from '../common/interfaces/pagination.interface';
import { UserModel } from '../users/entities/user.entity';
import { ChatsSocketMessageSenderEnum } from './enums/chats.socket-message-sender.enum';
import { WsException } from '@nestjs/websockets';
import {
  ChatsSendRoomMessageFromServerInterface,
  ChatsSendRoomMessageFromSocketInterface,
} from './interfaces/chats.send-message.interface';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatModel)
    private readonly chatsRepository: Repository<ChatModel>,
    private readonly paginationService: PaginationService,
  ) {}

  async createChat(dto: ChatsCreateChatDto): Promise<ChatModel> {
    const createdChat = this.chatsRepository.create(dto);

    return this.chatsRepository.save(createdChat);
  }

  async paginateChats(
    dto: ChatsPaginateChatsDto,
  ): Promise<PaginationResponse<ChatModel>> {
    return await this.paginationService.paginate<
      ChatModel,
      ChatsPaginateChatsDto
    >(dto, this.chatsRepository);
  }

  async createUserJoinChat(user: UserModel, chatId: number): Promise<boolean> {
    const chat = await this.chatsRepository.findOne({
      relations: ['users'],
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      throw new BadRequestException('채팅방이 존재하지 않습니다.');
    }

    chat.users.push(user);

    await this.chatsRepository.save(chat);

    return true;
  }

  async deleteUserLeaveChat(user: UserModel, chatId: number): Promise<boolean> {
    const chat = await this.chatsRepository.findOne({
      relations: ['users'],
      where: {
        id: chatId,
      },
    });

    /**
     * 이미 채팅방이 없는 경우, 에러를 던지기 보다 무시하는 방향으로 처리합니다.
     */
    if (!chat) {
      return true;
    }

    chat.users = chat.users.filter((chatUser) => chatUser.id !== user.id);

    await this.chatsRepository.save(chat);

    return true;
  }

  sendRoomMessageFromServer({
    server,
    chatId,
    event,
    message,
  }: ChatsSendRoomMessageFromServerInterface): void {
    try {
      server.in(chatId.toString()).emit(event, {
        from: ChatsSocketMessageSenderEnum.SYSTEM,
        message: message,
      });
    } catch (err) {
      throw new WsException('메시지 전송에 실패했습니다.');
    }
  }

  sendRoomMessageFromSocket({
    socket,
    chatId,
    senderId,
    event,
    message,
  }: ChatsSendRoomMessageFromSocketInterface): void {
    try {
      /**
       * 주의: socket.in().emit()는 server.in().emit()와 다릅니다.
       * server.in()는 해당 룸에 연결된 모든 소켓에 메시지를 보내지만, socket.in()는 대상이 되는 소켓을 제외합니다.
       * socket.in()과 socket.to()는 동일한 동작을 합니다.
       */
      socket.in(chatId.toString()).emit(event, {
        from: ChatsSocketMessageSenderEnum.USER,
        senderId,
        message,
      });
    } catch (err) {
      throw new WsException('메시지 전송에 실패했습니다.');
    }
  }
}
