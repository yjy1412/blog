import { Test, TestingModule } from '@nestjs/testing';
import { ChatsController } from '../chats.controller';
import { ChatsService } from '../chats.service';
import { RepositoryQueryOrderEnum } from '../../common/enums/repository.enum';
import { ChatsControllerMock } from './chats.controller.mock';
import { ChatModel } from '../entities/chats.entity';
import { PaginationResponse } from '../../common/interfaces/pagination.interface';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let chatsController: ChatsController;
  let mockChat: ChatModel;
  let mockChatsService: Partial<ChatsService>;

  beforeAll(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      providers: [ChatsControllerMock],
    }).compile();

    const chatsControllerMock =
      mockModule.get<ChatsControllerMock>(ChatsControllerMock);

    mockChat = chatsControllerMock.mockChat;
    mockChatsService = chatsControllerMock.mockChatsService;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsController],
      providers: [{ provide: ChatsService, useValue: mockChatsService }],
    }).compile();

    chatsController = module.get<ChatsController>(ChatsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ ChatsController >> createChat: 채팅방 생성 컨트롤러를 테스트합니다.', () => {
    test('채팅방 생성 컨트롤러가 존재합니다.', () => {
      expect(chatsController.createChat).toBeDefined();
    });

    test('채팅방 생성 서비스를 호출합니다.', async () => {
      const mockCreateChatDto = {
        name: 'test room',
        description: 'test용 채팅방입니다.',
      };

      await chatsController.createChat(mockCreateChatDto);

      expect(mockChatsService.createChat).toHaveBeenCalledWith(
        mockCreateChatDto,
      );
    });

    test('생성된 채팅방 정보를 반환합니다.', async () => {
      const mockCreateChatDto = {
        name: 'test room',
        description: 'test용 채팅방입니다.',
      };

      jest
        .spyOn(mockChatsService, 'createChat')
        .mockImplementationOnce(async () => mockChat);

      const result = await chatsController.createChat(mockCreateChatDto);

      expect(result).toEqual(mockChat);
    });
  });

  describe('✅ ChatsController >> paginateChats: 채팅방 목록 조회 컨트롤러를 테스트합니다.', () => {
    test('채팅방 목록 조회 컨트롤러가 존재합니다.', () => {
      expect(chatsController.paginateChats).toBeDefined();
    });

    test('채팅방 목록 조회 서비스를 호출합니다.', async () => {
      const mockPaginateChatsDto = {
        where_name_iLike: 'test',
        order_updatedAt: RepositoryQueryOrderEnum.DESC,
      };

      await chatsController.paginateChats(mockPaginateChatsDto);

      expect(mockChatsService.paginateChats).toHaveBeenCalledWith(
        mockPaginateChatsDto,
      );
    });

    test('조회된 채팅방 목록을 반환합니다.', async () => {
      const mockPaginateChatsDto = {
        where_name_iLike: 'test',
        order_updatedAt: RepositoryQueryOrderEnum.DESC,
      };

      const mockPaginationResponse: PaginationResponse<ChatModel> = {
        data: [mockChat],
        page: {
          currentPage: 1,
          totalPage: 1,
        },
      };

      jest
        .spyOn(mockChatsService, 'paginateChats')
        .mockImplementationOnce(async () => mockPaginationResponse);

      const result = await chatsController.paginateChats(mockPaginateChatsDto);

      expect(result).toEqual(mockPaginationResponse);
    });
  });
});
