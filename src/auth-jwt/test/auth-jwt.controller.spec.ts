import { Test, TestingModule } from '@nestjs/testing';
import { AuthJwtController } from '../auth-jwt.controller';
import { AuthJwtService } from '../auth-jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtMock } from './auth-jwt.mock.spec';
import { UserModel } from 'src/users/entities/user.entity';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let controller: AuthJwtController;
  let authMockJwt: AuthJwtMock;
  let mockNewUser: Pick<UserModel, 'email' | 'password' | 'name'>;
  let mockBasicToken: string;
  let mockBearerToken: string;
  let mockAuthJwtService: Partial<AuthJwtService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [AuthJwtMock],
    }).compile();

    authMockJwt = module.get<AuthJwtMock>(AuthJwtMock);

    mockNewUser = authMockJwt.mockNewUser;
    mockBasicToken = authMockJwt.mockBasicToken;
    mockBearerToken = authMockJwt.mockBearerToken;
    mockAuthJwtService = authMockJwt.mockAuthJwtService;
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
        accessToken: mockBearerToken,
        refreshToken: mockBearerToken,
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
        accessToken: mockBearerToken,
        refreshToken: mockBearerToken,
      });
    });
  });
});
