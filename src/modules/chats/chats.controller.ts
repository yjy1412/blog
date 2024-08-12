import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsCreateChatDto } from './dtos/chats.create-chat.dto';
import { ChatsPaginateChatsDto } from './dtos/chats.paginate-chats.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  createChat(@Body() body: ChatsCreateChatDto) {
    return this.chatsService.createChat(body);
  }

  @Get('pages')
  paginateChats(@Query() query: ChatsPaginateChatsDto) {
    return this.chatsService.paginateChats(query);
  }
}
