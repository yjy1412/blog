import { Test, TestingModule } from '@nestjs/testing';
import { AuthJwtService } from '../auth-jwt.service';
import { AuthJwtServiceMock } from './auth-jwt-service.mock.spec';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '../constants/auth-jwt.constant';
import { UsersService } from 'src/users/users.service';
import { UserModel } from 'src/users/entities/user.entity';

describe('AuthJwtService', () => {
  let authJwtService: AuthJwtService;

  let mockUser: UserModel;
  let mockJwtService: Partial<JwtService>;
  let mockUsersService: Partial<UsersService>;
  let mockUserRegistrationInfo: Pick<UserModel, 'email' | 'password' | 'name'>;

  beforeAll(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: JWT_SECRET })],
      providers: [AuthJwtServiceMock],
    }).compile();

    const authJwtServiceMock =
      mockModule.get<AuthJwtServiceMock>(AuthJwtServiceMock);

    mockUser = authJwtServiceMock.mockUser;
    mockJwtService = authJwtServiceMock.mockJwtService;
    mockUsersService = authJwtServiceMock.mockUsersService;
    mockUserRegistrationInfo = authJwtServiceMock.mockUserRegistrationInfo;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: JWT_SECRET })],
      providers: [
        AuthJwtService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authJwtService = module.get<AuthJwtService>(AuthJwtService);
  });

  describe('✅ AuthJwtService >> signBearerToken: 유저의 정보를 기반으로 Bearer Token을 생성합니다.', () => {
    test('Bearer Token에는 유저의 id, email, type 정보가 포함되어야 합니다.', async () => {
      authJwtService.signBearerToken(
        {
          id: mockUser.id,
          email: mockUser.email,
        },
        false,
      );

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
          type: 'access',
        },
        { expiresIn: '1d' },
      );
    });

    test('Refresh 토큰의 경우, 만료시간은 1시간이어야 합니다.', async () => {
      authJwtService.signBearerToken(
        {
          id: mockUser.id,
          email: mockUser.email,
        },
        true,
      );

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ expiresIn: '1h' }),
      );
    });
  });

  describe('✅ AuthJwtService >> authenticate: 유저의 정보를 기반으로 인증을 수행합니다.', () => {
    test('유저가 존재하지 않는 경우, UnauthorizedException을 반환합니다.', async () => {
      jest
        .spyOn(mockUsersService, 'getUserByEmail')
        .mockResolvedValueOnce(null);

      await expect(
        authJwtService.authenticate({
          email: mockUserRegistrationInfo.email,
          password: mockUserRegistrationInfo.password,
        }),
      ).rejects.toThrow('이메일이 일치하지 않습니다.');
    });

    test('비밀번호가 일치하지 않는 경우, UnauthorizedException을 반환합니다.', async () => {
      await expect(
        authJwtService.authenticate({
          email: mockUser.email,
          password: 'wrongPassword',
        }),
      ).rejects.toThrow('비밀번호가 일치하지 않습니다.');
    });
  });

  describe('✅ AuthJwtService >> login: 유저의 정보를 기반으로 로그인을 수행합니다.', () => {
    test('로그인 성공시, AccessToken과 RefreshToken을 반환합니다.', async () => {
      const result = await authJwtService.login({
        email: mockUserRegistrationInfo.email,
        password: mockUserRegistrationInfo.password,
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('✅ AuthJwtService >> register: 유저의 정보를 기반으로 회원가입을 수행합니다.', () => {
    test('회원가입에 사용된 비밀번호는 암호화하여 저장되어야 합니다.', async () => {
      await authJwtService.register(mockUserRegistrationInfo);

      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        ...mockUserRegistrationInfo,
        password: expect.any(String),
      });
    });
    test('회원가입 성공시, AccessToken과 RefreshToken을 반환합니다.', async () => {
      const result = await authJwtService.register(mockUserRegistrationInfo);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
