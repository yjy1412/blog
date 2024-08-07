import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { PaginateChatsDto } from './dtos/paginate-chats.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  createChat(@Body() body: CreateChatDto) {
    return this.chatsService.createChat(body);
  }

  @Get('pages')
  paginateChats(@Query() query: PaginateChatsDto) {
    return this.chatsService.paginateChats(query);
  }
}
