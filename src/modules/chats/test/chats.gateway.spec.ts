import { Test, TestingModule } from '@nestjs/testing';
import { ChatsGateway } from '../chats.gateway';
import { ChatsService } from '../chats.service';
import { CustomLoggerService } from '../../common/services/custom-logger.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AuthJwtService } from '../../auth-jwt/auth-jwt.service';
import { BadRequestException } from '@nestjs/common';
import { SocketEventEnum } from '../../common/enums/socket-event.enum';
import { Server } from 'socket.io';
import { ChatsSocketEventEnum } from '../enums/chats.socket-event.enum';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let chatsGateway: ChatsGateway;
  let socketServer: Server;

  const mockSocket = {
    handshake: {
      headers: {
        authorization: null,
      },
    },
    user: { id: 1, name: '테스터' },
    disconnect: jest.fn(),
    emit: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
  };

  const mockChatsService: Partial<ChatsService> = {
    createChat: jest.fn(),
    createUserJoinChat: jest.fn(),
    paginateChats: jest.fn(),
    sendRoomMessageFromServer: jest.fn(),
    sendRoomMessageFromSocket: jest.fn(),
    deleteUserLeaveChat: jest.fn(),
  };

  const mockUsersService: Partial<UsersService> = {
    getUserById: jest.fn(),
  };

  const mockAuthJwtService: Partial<AuthJwtService> = {
    extractTokenFromHeader: jest.fn(),
    verifyBearerToken: jest.fn(),
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
        {
          provide: AuthJwtService,
          useValue: mockAuthJwtService,
        },
      ],
    }).compile();

    chatsGateway = module.get<ChatsGateway>(ChatsGateway);
    chatsGateway.afterInit(socketServer);
  });

  describe('✅ ChatsGateway >> handelConnection: 소켓 연결 시 처리로직을 테스트합니다.', () => {
    test('소켓 연결처리를 담당하는 메서드가 존재합니다.', () => {
      expect(chatsGateway.handleConnection).toBeDefined();
    });

    test('헤더에서 토큰을 추출합니다. 만약 토큰이 존재하지 않으면 관련 예외 메시지와 함께 연결해제 됩니다.', async () => {
      jest
        .spyOn(mockAuthJwtService, 'extractTokenFromHeader')
        .mockImplementationOnce(() => {
          throw new BadRequestException('토큰이 유효하지 않습니다');
        });

      await chatsGateway.handleConnection(mockSocket as any);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        SocketEventEnum.EXCEPTION,
        '인증에 실패했습니다. 재로그인이 필요합니다.',
      );
      expect(mockSocket.disconnect).toHaveBeenCalledWith(true);
    });

    test('토큰 검증에 실패하면 관련 예외 메시지와 함께 연결해제 됩니다.', async () => {
      jest
        .spyOn(mockAuthJwtService, 'verifyBearerToken')
        .mockImplementationOnce(() => {
          throw new BadRequestException('토큰이 만료되었습니다');
        });

      await chatsGateway.handleConnection(mockSocket as any);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        SocketEventEnum.EXCEPTION,
        '인증에 실패했습니다. 재로그인이 필요합니다.',
      );
      expect(mockSocket.disconnect).toHaveBeenCalledWith(true);
    });

    test('토큰 검증을 통해 얻은 유저 정보가 유효하지 않으면 관련 예외 메시지와 함께 연결해제 됩니다.', async () => {
      jest.spyOn(mockUsersService, 'getUserById').mockImplementationOnce(() => {
        throw new BadRequestException('유저 정보를 찾을 수 없습니다');
      });

      await chatsGateway.handleConnection(mockSocket as any);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        SocketEventEnum.EXCEPTION,
        '인증에 실패했습니다. 재로그인이 필요합니다.',
      );
      expect(mockSocket.disconnect).toHaveBeenCalledWith(true);
    });
  });

  describe('✅ ChatsGateway >> joinChat: 채팅방 입장 시 처리로직을 테스트합니다.', () => {
    test('채팅방 입장처리를 담당하는 메서드가 존재합니다.', () => {
      expect(chatsGateway.joinChat).toBeDefined();
    });

    test('유저의 채팅방 입장정보를 저장합니다.', async () => {
      const mockBody = { chatId: 1 };

      await chatsGateway.joinChat(mockSocket as any, mockBody);

      expect(mockChatsService.createUserJoinChat).toHaveBeenCalledWith(
        mockSocket.user,
        mockBody.chatId,
      );
    });

    test('요청 소켓이 해당 채팅방에 join 합니다.', async () => {
      const mockBody = { chatId: 1 };

      await chatsGateway.joinChat(mockSocket as any, mockBody);

      expect(mockSocket.join).toHaveBeenCalledWith(mockBody.chatId.toString());
    });

    test('채팅방 입장 메시지를 전송합니다.', async () => {
      const mockBody = { chatId: 1 };

      await chatsGateway.joinChat(mockSocket as any, mockBody);

      expect(mockChatsService.sendRoomMessageFromServer).toHaveBeenCalledWith({
        server: socketServer,
        chatId: mockBody.chatId,
        event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
        message: `[${mockSocket.user.name}] 님이 채팅방에 입장하셨습니다.`,
      });
    });
  });

  describe('✅ ChatsGateway >> leaveChat: 채팅방 퇴장 시 처리로직을 테스트합니다.', () => {
    test('채팅방 퇴장처리를 담당하는 메서드가 존재합니다.', () => {
      expect(chatsGateway.leaveChat).toBeDefined();
    });

    test('유저의 채팅방 퇴장정보를 저장합니다.', async () => {
      const mockBody = { chatId: 1 };

      await chatsGateway.leaveChat(mockSocket as any, mockBody);

      expect(mockChatsService.deleteUserLeaveChat).toHaveBeenCalledWith(
        mockSocket.user,
        mockBody.chatId,
      );
    });

    test('요청 소켓이 해당 채팅방에서 leave 합니다.', async () => {
      const mockBody = { chatId: 1 };

      await chatsGateway.leaveChat(mockSocket as any, mockBody);

      expect(mockSocket.leave).toHaveBeenCalledWith(mockBody.chatId.toString());
    });

    test('채팅방 퇴장 메시지를 전송합니다.', async () => {
      const mockBody = { chatId: 1 };

      await chatsGateway.leaveChat(mockSocket as any, mockBody);

      expect(mockChatsService.sendRoomMessageFromServer).toHaveBeenCalledWith({
        server: socketServer,
        chatId: mockBody.chatId,
        event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
        message: `[${mockSocket.user.name}] 님이 채팅방에서 퇴장하셨습니다.`,
      });
    });
  });

  describe('✅ ChatsGateway >> sendMessage: 채팅 메시지 전송 시 처리로직을 테스트합니다.', () => {
    test('채팅 메시지 전송처리를 담당하는 메서드가 존재합니다.', () => {
      expect(chatsGateway.sendMessage).toBeDefined();
    });

    test('채팅 메시지를 전송합니다.', async () => {
      const mockBody = { chatId: 1, message: '안녕하세요' };

      await chatsGateway.sendMessage(mockSocket as any, mockBody);

      expect(mockChatsService.sendRoomMessageFromSocket).toHaveBeenCalledWith({
        socket: mockSocket,
        chatId: mockBody.chatId,
        senderId: mockSocket.user.id,
        event: ChatsSocketEventEnum.RECEIVE_MESSAGE,
        message: mockBody.message,
      });
    });
  });
});
