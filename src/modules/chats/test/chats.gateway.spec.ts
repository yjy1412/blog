import { Test, TestingModule } from '@nestjs/testing';
import { ChatsGateway } from '../chats.gateway';
import { ChatsService } from '../chats.service';
import { CustomLoggerService } from '../../common/services/custom-logger.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

describe('ChatsGateway', () => {
  let gateway: ChatsGateway;

  const mockChatsService: Partial<ChatsService> = {
    createChat: jest.fn(),
    createUserJoinChat: jest.fn(),
    paginateChats: jest.fn(),
  };

  const mockUsersService: Partial<UsersService> = {
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsGateway,
        ConfigService,
        CustomLoggerService,
        {
          provide: ChatsService,
          useValue: mockChatsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    gateway = module.get<ChatsGateway>(ChatsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
