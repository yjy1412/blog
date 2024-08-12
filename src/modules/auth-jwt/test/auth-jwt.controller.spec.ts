import { Test, TestingModule } from '@nestjs/testing';
import { AuthJwtController } from '../auth-jwt.controller';
import { AuthJwtService } from '../auth-jwt.service';
import { AuthJwtControllerMock } from './auth-jwt.controller.mock';
import { UserModel } from '../../users/entities/users.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let mockUserRegistrationInfo: Pick<UserModel, 'email' | 'password' | 'name'>;
  let mockBasicToken: string;
  let mockRefreshToken: string;
  let mockExiredRefreshToken: string;
  let mockAuthJwtService: Partial<AuthJwtService>;

  let authJwtController: AuthJwtController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthJwtControllerMock],
    }).compile();

    const authJwtControllerMock = module.get<AuthJwtControllerMock>(
      AuthJwtControllerMock,
    );

    mockUserRegistrationInfo = authJwtControllerMock.mockUserRegistrationInfo;
    mockBasicToken = authJwtControllerMock.mockBasicToken;
    mockRefreshToken = authJwtControllerMock.mockRefreshToken;
    mockExiredRefreshToken = authJwtControllerMock.mockExiredRefreshToken;
    mockAuthJwtService = authJwtControllerMock.mockAuthJwtService;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthJwtController],
      providers: [
        {
          provide: AuthJwtService,
          useValue: mockAuthJwtService,
        },
      ],
    }).compile();

    authJwtController = module.get<AuthJwtController>(AuthJwtController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ AuthJwtController >> register: 회원가입 요청', () => {
    test('회원가입 요청 컨트롤러 메서드가 정의되어 있습니다.', () => {
      expect(authJwtController.register).toBeDefined();
    });

    test('관련 서비스가 호출되어야 합니다.', async () => {
      await authJwtController.register(mockUserRegistrationInfo);

      expect(mockAuthJwtService.register).toHaveBeenCalledWith(
        mockUserRegistrationInfo,
      );
    });

    test('액세스/리프레쉬 토큰이 반환되어야 합니다.', async () => {
      const response = await authJwtController.register(
        mockUserRegistrationInfo,
      );

      expect(response).toHaveProperty('accessToken');
      expect(response).toHaveProperty('refreshToken');
    });
  });

  describe('✅ AuthJwtController >> login: 로그인 요청', () => {
    test('로그인 요청 컨트롤러 메서드가 정의되어 있습니다.', () => {
      expect(authJwtController.login).toBeDefined();
    });

    test('요청 헤더의 authorization 값이 "Basic email:password(Base64 encoded)" 형식이어야 합니다.', async () => {
      await authJwtController.login(`Basic ${mockBasicToken}`);

      expect(mockAuthJwtService.extractTokenFromHeader).toHaveBeenCalledWith(
        `Basic ${mockBasicToken}`,
        false,
      );
    });

    test('관련 서비스가 호출되어야 합니다.', async () => {
      await authJwtController.login(`Basic ${mockBasicToken}`);

      expect(mockAuthJwtService.login).toHaveBeenCalledWith({
        email: mockUserRegistrationInfo.email,
        password: mockUserRegistrationInfo.password,
      });
    });

    test('액세스/리프레쉬 토큰이 반환되어야 합니다.', async () => {
      const response = await authJwtController.login(`Basic ${mockBasicToken}`);

      expect(response).toHaveProperty('accessToken');
      expect(response).toHaveProperty('refreshToken');
    });
  });

  describe(`✅ AuthJwtController >> access: 액세스 토큰 재발급 요청`, () => {
    test('액세스 토큰 재발급 요청 컨트롤러 메서드가 정의되어 있습니다.', () => {
      expect(authJwtController.access).toBeDefined();
    });

    test('관련 서비스가 호출되어야 합니다.', async () => {
      await authJwtController.access(`Bearer ${mockRefreshToken}`);

      expect(
        mockAuthJwtService.refreshAccessTokenUsingRefreshToken,
      ).toHaveBeenCalledWith(mockRefreshToken);
    });

    test('인증에 실패한 경우, 401 Unauthorized가 반환되어야 합니다.', async () => {
      jest
        .spyOn(mockAuthJwtService, 'refreshAccessTokenUsingRefreshToken')
        .mockImplementationOnce(() => {
          throw new UnauthorizedException();
        });

      await expect(
        authJwtController.access(`Bearer ${mockExiredRefreshToken}`),
      ).rejects.toThrow(UnauthorizedException);
    });

    test('액세스 토큰 재발급 요청 시 액세스 토큰이 반환되어야 합니다.', async () => {
      const response = await authJwtController.access(
        `Bearer ${mockRefreshToken}`,
      );

      expect(response).toHaveProperty('accessToken');
    });
  });
});
