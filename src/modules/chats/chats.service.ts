import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatModel } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dtos/create-chat.dto';
import { UsersService } from '../users/users.service';
import { PaginationService } from '../common/services/pagination.service';
import { PaginateChatsDto } from './dtos/paginate-chats.dto';
import { PaginationResponse } from '../common/interfaces/pagination.interface';
import { UserModel } from '../users/entities/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatModel)
    private readonly chatsRepository: Repository<ChatModel>,
    private readonly usersService: UsersService,
    private readonly paginationService: PaginationService,
  ) {}

  async createChat(dto: CreateChatDto): Promise<ChatModel> {
    const createdChat = this.chatsRepository.create(dto);

    return this.chatsRepository.save(createdChat);
  }

  async paginateChats(
    dto: PaginateChatsDto,
  ): Promise<PaginationResponse<ChatModel>> {
    return await this.paginationService.paginate<ChatModel, PaginateChatsDto>(
      dto,
      this.chatsRepository,
    );
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
}
