import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatModel } from './entities/chats.entity';
import { Repository } from 'typeorm';
import { ChatsCreateChatDto } from './dtos/chats.create-chat.dto';
import { PaginationService } from '../common/services/pagination.service';
import { ChatsPaginateChatsDto } from './dtos/chats.paginate-chats.dto';
import { PaginationResponse } from '../common/interfaces/pagination.interface';
import { UserModel } from '../users/entities/users.entity';
import { ChatsSocketMessageSenderEnum } from './enums/chats.socket-message-sender.enum';
import {
  ChatsSocketMessageFromServerInRoom,
  ChatsSocketMessageFromClientToRoom,
} from './interfaces/chats.send-message.interface';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatModel)
    private readonly chatsRepository: Repository<ChatModel>,
    private readonly paginationService: PaginationService,
  ) {}

  async createChat(newChat: ChatsCreateChatDto): Promise<ChatModel> {
    const createdChat = this.chatsRepository.create(newChat);

    return this.chatsRepository.save(createdChat);
  }

  async paginateChats(
    paginateQuery: ChatsPaginateChatsDto,
  ): Promise<PaginationResponse<ChatModel>> {
    return await this.paginationService.paginate<
      ChatModel,
      ChatsPaginateChatsDto
    >(paginateQuery, this.chatsRepository);
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
  }: ChatsSocketMessageFromServerInRoom): void {
    server.in(chatId.toString()).emit(event, {
      from: ChatsSocketMessageSenderEnum.SYSTEM,
      message: message,
    });
  }

  async sendRoomMessageFromSocket({
    socket,
    chatId,
    senderId,
    event,
    message,
  }: ChatsSocketMessageFromClientToRoom): Promise<void> {
    await this.checkIsUserInChat(senderId, chatId);

    /**
     * 주의
     * socket.to().emit()은 대상이 되는 소켓을 제외하고, 해당 룸에 연결된 모든 소켓에 메시지를 전송합니다.
     * socket.to()와 socket.in()은 동일한 기능을 수행합니다.
     *
     * 참고로, server.in().emit()은 해당 룸에 연결된 모든 소켓에 메시지를 전송합니다. (마찬가지로 server.to()와 동일합니다.)
     */
    socket.to(chatId.toString()).emit(event, {
      from: ChatsSocketMessageSenderEnum.USER,
      senderId,
      message,
    });
  }

  async checkIsUserInChat(userId: number, chatId: number): Promise<void> {
    const result = await this.chatsRepository.exists({
      relations: ['users'],
      where: {
        id: chatId,
        users: {
          id: userId,
        },
      },
    });

    if (!result) {
      throw new BadRequestException(
        `유저 [ id: ${userId} ]는 요청 채팅방 [ id: ${chatId} ]에 속해있지 않습니다.`,
      );
    }
  }
}
