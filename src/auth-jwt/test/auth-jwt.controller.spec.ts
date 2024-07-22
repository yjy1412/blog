import { Test, TestingModule } from '@nestjs/testing';
import { AuthJwtController } from '../auth-jwt.controller';
import { AuthJwtService } from '../auth-jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtMock } from './auth-jwt.mock.spec';
import { UserModel } from 'src/users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let controller: AuthJwtController;
  let authMockJwt: AuthJwtMock;
  let mockNewUser: Pick<UserModel, 'email' | 'password' | 'name'>;
  let mockBasicToken: string;
  let mockBearerTokenForAccess: string;
  let mockBearerTokenForRefresh: string;
  let mockAuthJwtService: Partial<AuthJwtService>;
  let mockExpiredBearerTokenForRefesh: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [AuthJwtMock],
    }).compile();

    authMockJwt = module.get<AuthJwtMock>(AuthJwtMock);

    mockNewUser = authMockJwt.mockNewUser;
    mockBasicToken = authMockJwt.mockBasicToken;
    mockBearerTokenForAccess = authMockJwt.mockBearerTokenForAccess;
    mockBearerTokenForRefresh = authMockJwt.mockBearerTokenForRefresh;
    mockAuthJwtService = authMockJwt.mockAuthJwtService;
    mockExpiredBearerTokenForRefesh =
      authMockJwt.mockExpiredBearerTokenForRefesh;
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
    it('회원가입 요청 컨트롤러 메서드가 정의되어 있습니다.', () => {
      expect(controller.register).toBeDefined();
    });

    it('회원가입 요청 시 관련 서비스가 호출되어야 합니다.', async () => {
      await controller.register(mockNewUser);

      expect(mockAuthJwtService.register).toHaveBeenCalledWith(mockNewUser);
    });

    it('회원가입 요청 시 액세스/리프레쉬 토큰이 반환되어야 합니다.', async () => {
      const response = await controller.register(mockNewUser);

      expect(response).toEqual({
        accessToken: mockBearerTokenForAccess,
        refreshToken: mockBearerTokenForRefresh,
      });
    });
  });

  describe('✅ AuthJwtController >> login: 로그인 요청', () => {
    it('로그인 요청 컨트롤러 메서드가 정의되어 있습니다.', () => {
      expect(controller.login).toBeDefined();
    });

    it('로그인 요청 시, 요청 헤더의 authorization 값이 "Basic email:password(Base64 encoded)" 형식이어야 합니다.', async () => {
      await controller.login(`Basic ${mockBasicToken}`);

      expect(
        authMockJwt.mockAuthJwtService.extractTokenFromHeader,
      ).toHaveBeenCalledWith(`Basic ${mockBasicToken}`, false);
    });

    it('로그인 요청 시 관련 서비스가 호출되어야 합니다.', async () => {
      await controller.login(`Basic ${mockBasicToken}`);

      expect(authMockJwt.mockAuthJwtService.login).toHaveBeenCalledWith({
        email: mockNewUser.email,
        password: mockNewUser.password,
      });
    });

    it('로그인 요청 시 액세스/리프레쉬 토큰이 반환되어야 합니다.', async () => {
      const response = await controller.login(`Basic ${mockBasicToken}`);

      expect(response).toEqual({
        accessToken: mockBearerTokenForAccess,
        refreshToken: mockBearerTokenForRefresh,
      });
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

    it('리프레쉬 토큰이 만료된 경우, 401 Unauthorized가 반환되어야 합니다.', async () => {
      jest
        .spyOn(mockAuthJwtService, 'refreshAccessTokenUsingRefreshToken')
        .mockImplementationOnce(() => {
          throw new UnauthorizedException();
        });

      await expect(
        controller.access(`Bearer ${mockExpiredBearerTokenForRefesh}`),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('리프레쉬 토큰에 담긴 type 정보가 "refresh"가 아닌 경우, 401 Unauthorized가 반환되어야 합니다.', async () => {
      jest
        .spyOn(mockAuthJwtService, 'refreshAccessTokenUsingRefreshToken')
        .mockImplementationOnce(() => {
          throw new UnauthorizedException();
        });

      await expect(
        controller.access(`Bearer ${mockBearerTokenForAccess}`),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('액세스 토큰 재발급 요청 시 액세스 토큰이 반환되어야 합니다.', async () => {
      const response = await controller.access(
        `Bearer ${mockBearerTokenForRefresh}`,
      );

      expect(response).toEqual({
        accessToken: mockBearerTokenForAccess,
      });
    });
  });
});
