import { PickType } from '@nestjs/mapped-types';
import { ChatModel } from '../entities/chats.entity';

export class ChatsCreateChatDto extends PickType(ChatModel, [
  'name',
  'description',
]) {}
