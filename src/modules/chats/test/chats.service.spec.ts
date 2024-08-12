import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from '../chats.service';
import { PaginationService } from '../../common/services/pagination.service';
import { UsersService } from '../../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatModel } from '../entities/chats.entity';
import { Repository } from 'typeorm';

describe('ChatsService', () => {
  let chatsService: ChatsService;

  const mockPaginationService: Partial<PaginationService> = {
    paginate: jest.fn(),
  };
  const mockUsersService: Partial<UsersService> = {
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        { provide: PaginationService, useValue: mockPaginationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: getRepositoryToken(ChatModel), useClass: Repository },
      ],
    }).compile();

    chatsService = module.get<ChatsService>(ChatsService);
  });

  it('should be defined', () => {
    expect(chatsService).toBeDefined();
  });
});
