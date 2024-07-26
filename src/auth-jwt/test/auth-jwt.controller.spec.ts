import { Test, TestingModule } from '@nestjs/testing';
import { AuthJwtController } from '../auth-jwt.controller';
import { AuthJwtService } from '../auth-jwt.service';
import { AuthJwtControllerMock } from './auth-jwt-controller.mock.spec';
import { UserModel } from '../../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let controller: AuthJwtController;

  let mockUserRegistrationInfo: Pick<UserModel, 'email' | 'password' | 'name'>;
  let mockBasicToken: string;
  let mockRefreshToken: string;
  let mockExiredRefreshToken: string;
  let mockAuthJwtService: Partial<AuthJwtService>;

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

    controller = module.get<AuthJwtController>(AuthJwtController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ AuthJwtController >> register: 회원가입 요청', () => {
    test('회원가입 요청 컨트롤러 메서드가 정의되어 있습니다.', () => {
      expect(controller.register).toBeDefined();
    });

    test('관련 서비스가 호출되어야 합니다.', async () => {
      await controller.register(mockUserRegistrationInfo);

      expect(mockAuthJwtService.register).toHaveBeenCalledWith(
        mockUserRegistrationInfo,
      );
    });

    test('액세스/리프레쉬 토큰이 반환되어야 합니다.', async () => {
      const response = await controller.register(mockUserRegistrationInfo);

      expect(response).toHaveProperty('accessToken');
      expect(response).toHaveProperty('refreshToken');
    });
  });

  describe('✅ AuthJwtController >> login: 로그인 요청', () => {
    test('로그인 요청 컨트롤러 메서드가 정의되어 있습니다.', () => {
      expect(controller.login).toBeDefined();
    });

    test('요청 헤더의 authorization 값이 "Basic email:password(Base64 encoded)" 형식이어야 합니다.', async () => {
      await controller.login(`Basic ${mockBasicToken}`);

      expect(mockAuthJwtService.extractTokenFromHeader).toHaveBeenCalledWith(
        `Basic ${mockBasicToken}`,
        false,
      );
    });

    test('관련 서비스가 호출되어야 합니다.', async () => {
      await controller.login(`Basic ${mockBasicToken}`);

      expect(mockAuthJwtService.login).toHaveBeenCalledWith({
        email: mockUserRegistrationInfo.email,
        password: mockUserRegistrationInfo.password,
      });
    });

    test('액세스/리프레쉬 토큰이 반환되어야 합니다.', async () => {
      const response = await controller.login(`Basic ${mockBasicToken}`);

      expect(response).toHaveProperty('accessToken');
      expect(response).toHaveProperty('refreshToken');
    });
  });

  /**
   * 액세스 토큰 재발급 로직 테스트
   * 0. 컨트롤러 정의
   * 1. 리프레쉬 토큰을 헤더 authorization에 담아 요청
   *  1-1. 리프레쉬 토큰이 만료된 경우, 401 Unauthorized
   *  1-2. 리프레쉬 토큰에 담긴 type 정보가 'refresh'가 아닌 경우, 401 Unauthorized
   *  1-3. 리프레쉬 토큰이 유효한 경우, 액세스 토큰 재발급
   */
  describe(`✅ AuthJwtController >> access: 액세스 토큰 재발급 요청`, () => {
    it('액세스 토큰 재발급 요청 컨트롤러 메서드가 정의되어 있습니다.', () => {
      expect(controller.access).toBeDefined();
    });

    it('관련 서비스가 호출되어야 합니다.', async () => {
      await controller.access(`Bearer ${mockRefreshToken}`);

      expect(
        mockAuthJwtService.refreshAccessTokenUsingRefreshToken,
      ).toHaveBeenCalledWith(mockRefreshToken);
    });

    it('인증에 실패한 경우, 401 Unauthorized가 반환되어야 합니다.', async () => {
      jest
        .spyOn(mockAuthJwtService, 'refreshAccessTokenUsingRefreshToken')
        .mockImplementationOnce(() => {
          throw new UnauthorizedException();
        });

      await expect(
        controller.access(`Bearer ${mockExiredRefreshToken}`),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('액세스 토큰 재발급 요청 시 액세스 토큰이 반환되어야 합니다.', async () => {
      const response = await controller.access(`Bearer ${mockRefreshToken}`);

      expect(response).toHaveProperty('accessToken');
    });
  });
});
