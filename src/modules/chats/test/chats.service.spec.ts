import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from '../chats.service';
import { PaginationService } from '../../common/services/pagination.service';
import { UsersService } from '../../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatModel } from '../entities/chats.entity';
import { Repository } from 'typeorm';
import { RepositoryQueryOrderEnum } from '../../common/enums/repository.enum';
import { ChatsServiceMock } from './chats.service.mock';
import { UserModel } from '../../users/entities/users.entity';
import { ChatsSocketEventEnum } from '../enums/chats.socket-event.enum';
import {
  ChatsSocketMessageFromClientToRoom,
  ChatsSocketMessageFromServerInRoom,
} from '../interfaces/chats.send-message.interface';
import { ChatsSocketMessageSenderEnum } from '../enums/chats.socket-message-sender.enum';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let chatsService: ChatsService;
  let chatsRepository: Repository<ChatModel>;
  let mockUser: UserModel;
  let mockChat: ChatModel;
  let mockPaginationService: Partial<PaginationService>;
  let mockUsersService: Partial<UsersService>;
  let mockSocketServer: any;
  let mockSocket: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatsServiceMock],
    }).compile();

    const chatsServiceMock = module.get<ChatsServiceMock>(ChatsServiceMock);

    mockUser = chatsServiceMock.mockUser;
    mockChat = chatsServiceMock.mockChat;
    mockPaginationService = chatsServiceMock.mockPaginationService;
    mockUsersService = chatsServiceMock.mockUsersService;
    mockSocketServer = chatsServiceMock.mockSocketServer;
    mockSocket = chatsServiceMock.mockSocket;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        { provide: PaginationService, useValue: mockPaginationService },
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: getRepositoryToken(ChatModel),
          useClass: Repository,
        },
      ],
    }).compile();

    chatsService = module.get<ChatsService>(ChatsService);
    chatsRepository = module.get<Repository<ChatModel>>(
      getRepositoryToken(ChatModel),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ ChatsService >> createChat: 채팅방 생성 서비스를 테스트합니다.', () => {
    test('채팅방 생성 서비스가 존재합니다.', () => {
      expect(chatsService.createChat).toBeDefined();
    });

    test('채팅방을 생성합니다.', async () => {
      const mockCreateChatDto = {
        name: 'test room',
        description: 'test용 채팅방입니다.',
      };

      jest
        .spyOn(chatsRepository, 'create')
        .mockImplementationOnce(() => mockChat as any);

      jest
        .spyOn(chatsRepository, 'save')
        .mockImplementationOnce(() => Promise.resolve(mockChat as any));

      const result = await chatsService.createChat(mockCreateChatDto);

      expect(result).toEqual(mockChat);
    });
  });

  describe('✅ ChatsService >> paginateChats: 채팅방 목록 조회 서비스를 테스트합니다.', () => {
    test('채팅방 목록 조회 서비스가 존재합니다.', () => {
      expect(chatsService.paginateChats).toBeDefined();
    });

    test('채팅방 목록을 조회하여 반환합니다.', async () => {
      const mockPaginateQuery = {
        where_name_iLike: 'test',
        order_updatedAt: RepositoryQueryOrderEnum.DESC,
      };

      const mockPaginateResult = {
        data: [
          {
            id: 1,
            name: 'test room',
            description: 'test용 채팅방입니다.',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        page: {
          currentPage: 1,
          totalPage: 1,
        },
      };

      jest
        .spyOn(mockPaginationService, 'paginate')
        .mockResolvedValueOnce(mockPaginateResult as any);

      const result = await chatsService.paginateChats(mockPaginateQuery);

      expect(result).toEqual(mockPaginateResult);
    });
  });

  describe('✅ ChatsService >> createUserJoinChat: 채팅방 참여 로직을 테스트합니다.', () => {
    test('채팅방 참여 서비스가 존재합니다.', () => {
      expect(chatsService.createUserJoinChat).toBeDefined();
    });

    test('채팅방이 존재하지 않는 경우 BadRequestException을 반환합니다.', async () => {
      jest
        .spyOn(chatsRepository, 'findOne')
        .mockResolvedValueOnce(undefined as any);

      await expect(
        chatsService.createUserJoinChat(mockUser, mockChat.id),
      ).rejects.toThrow('채팅방이 존재하지 않습니다.');
    });

    test('채팅방 참여를 처리합니다.', async () => {
      jest
        .spyOn(chatsRepository, 'findOne')
        .mockResolvedValueOnce(mockChat as any);

      jest
        .spyOn(chatsRepository, 'save')
        .mockImplementationOnce(() => Promise.resolve(mockChat as any));

      const result = await chatsService.createUserJoinChat(
        mockUser,
        mockChat.id,
      );

      expect(result).toEqual(true);
    });
  });

  describe('✅ ChatsService >> deleteUserLeaveChat: 채팅방 탈퇴 로직을 테스트합니다.', () => {
    test('채팅방 탈퇴 서비스가 존재합니다.', () => {
      expect(chatsService.deleteUserLeaveChat).toBeDefined();
    });

    test('채팅방이 존재하지 않는 경우 true를 반환합니다.', async () => {
      jest
        .spyOn(chatsRepository, 'findOne')
        .mockResolvedValueOnce(undefined as any);

      const result = await chatsService.deleteUserLeaveChat(
        mockUser,
        mockChat.id,
      );

      expect(result).toEqual(true);
    });

    test('채팅방 탈퇴를 처리합니다.', async () => {
      jest
        .spyOn(chatsRepository, 'findOne')
        .mockResolvedValueOnce(mockChat as any);

      jest
        .spyOn(chatsRepository, 'save')
        .mockImplementationOnce(() => Promise.resolve(mockChat as any));

      const result = await chatsService.deleteUserLeaveChat(
        mockUser,
        mockChat.id,
      );

      expect(result).toEqual(true);
    });
  });

  describe('✅ ChatsService >> sendRoomMessageFromServer: 채팅방 메시지 전송 로직을 테스트합니다.', () => {
    test('채팅방 메시지 전송 서비스가 존재합니다.', () => {
      expect(chatsService.sendRoomMessageFromServer).toBeDefined();
    });

    test('server.in().emit() 메서드를 호출해야 합니다', () => {
      const mockChatsSocketMessageFromServerInRoom: ChatsSocketMessageFromServerInRoom =
        {
          server: mockSocketServer,
          chatId: mockChat.id,
          event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
          message: 'test message',
        };

      chatsService.sendRoomMessageFromServer(
        mockChatsSocketMessageFromServerInRoom,
      );

      expect(
        mockChatsSocketMessageFromServerInRoom.server.in,
      ).toHaveBeenCalledWith(mockChat.id.toString());

      expect(
        mockChatsSocketMessageFromServerInRoom.server.in(mockChat.id.toString())
          .emit,
      ).toHaveBeenCalledWith(mockChatsSocketMessageFromServerInRoom.event, {
        from: ChatsSocketMessageSenderEnum.SYSTEM,
        message: mockChatsSocketMessageFromServerInRoom.message,
      });
    });
  });

  describe('✅ ChatsService >> sendRoomMessageFromSocket: 채팅방 메시지 전송 로직을 테스트합니다.', () => {
    test('채팅방 메시지 전송 서비스가 존재합니다.', () => {
      expect(chatsService.sendRoomMessageFromSocket).toBeDefined();
    });

    test('socket.to().emit() 메서드를 호출해야 합니다', async () => {
      const mockChatsSocketMessageFromClientToRoom: ChatsSocketMessageFromClientToRoom =
        {
          socket: mockSocket,
          chatId: mockChat.id,
          senderId: mockUser.id,
          event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
          message: 'test message',
        };

      jest
        .spyOn(chatsService, 'checkIsUserInChat')
        .mockResolvedValueOnce(undefined as any);

      await chatsService.sendRoomMessageFromSocket(
        mockChatsSocketMessageFromClientToRoom,
      );

      expect(
        mockChatsSocketMessageFromClientToRoom.socket.to,
      ).toHaveBeenCalledWith(mockChat.id.toString());

      expect(
        mockChatsSocketMessageFromClientToRoom.socket.to(mockChat.id.toString())
          .emit,
      ).toHaveBeenCalledWith(mockChatsSocketMessageFromClientToRoom.event, {
        from: ChatsSocketMessageSenderEnum.USER,
        senderId: mockChatsSocketMessageFromClientToRoom.senderId,
        message: mockChatsSocketMessageFromClientToRoom.message,
      });
    });
  });

  describe('✅ ChatsService >> checkIsUserInChat: 채팅방 참여 여부 확인 로직을 테스트합니다.', () => {
    test('채팅방 참여 여부 확인 서비스가 존재합니다.', () => {
      expect(chatsService.checkIsUserInChat).toBeDefined();
    });

    test('채팅방에 참여하지 않은 유저가 요청한 경우 BadRequestException을 반환합니다.', async () => {
      jest.spyOn(chatsRepository, 'exists').mockResolvedValueOnce(false as any);

      await expect(
        chatsService.checkIsUserInChat(mockUser.id, mockChat.id),
      ).rejects.toThrow(
        `유저 [ id: ${mockUser.id} ]는 요청 채팅방 [ id: ${mockChat.id} ]에 속해있지 않습니다.`,
      );
    });
  });
});
