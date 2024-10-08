import { Test, TestingModule } from '@nestjs/testing';
import { AuthJwtService } from '../auth-jwt.service';
import { AuthJwtServiceMock } from './auth-jwt.service.mock';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { UserModel } from '../../users/entities/users.entity';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BearerTokenTypeEnum } from '../enums/auth-jwt.enum';

describe('AuthJwtService', () => {
  let mockUser: UserModel;
  let mockJwtService: Partial<JwtService>;
  let mockUsersService: Partial<UsersService>;
  let mockUserRegistrationInfo: Pick<UserModel, 'email' | 'password' | 'name'>;
  let mockBearerTokenPayloadWithoutType: Pick<UserModel, 'id' | 'email'>;
  let mockSocket: any;

  let authJwtService: AuthJwtService;

  beforeAll(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      providers: [AuthJwtServiceMock],
    }).compile();

    const authJwtServiceMock =
      mockModule.get<AuthJwtServiceMock>(AuthJwtServiceMock);

    mockUser = authJwtServiceMock.mockUser;
    mockJwtService = authJwtServiceMock.mockJwtService;
    mockUsersService = authJwtServiceMock.mockUsersService;
    mockUserRegistrationInfo = authJwtServiceMock.mockUserRegistrationInfo;
    mockBearerTokenPayloadWithoutType =
      authJwtServiceMock.mockBearerTokenPayloadWithoutType;
    mockSocket = authJwtServiceMock.mockSocket;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthJwtService,
        ConfigService,
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
      authJwtService.signBearerToken(mockBearerTokenPayloadWithoutType, false);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          ...mockBearerTokenPayloadWithoutType,
          type: 'access',
        },
        { expiresIn: '1h' },
      );
    });

    test('Refresh 토큰의 경우, 만료시간은 하루여야 합니다.', async () => {
      authJwtService.signBearerToken(mockBearerTokenPayloadWithoutType, true);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ expiresIn: '1d' }),
      );
    });
  });

  describe('✅ AuthJwtService >> authenticate: 유저의 정보를 기반으로 인증을 수행합니다.', () => {
    test('유저가 존재하지 않는 경우, UnauthorizedException을 반환합니다.', async () => {
      jest
        .spyOn(mockUsersService, 'getUserByEmailWithPassword')
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

  describe('✅ AuthJwtService >> authorizeUserForSocket: socket 연결 시 필요한 인증절차를 진행합니다.', () => {
    test('헤더에 토큰이 없는 경우, BadRequestException을 반환합니다.', async () => {
      jest
        .spyOn(authJwtService, 'extractTokenFromHeader')
        .mockImplementationOnce(() => {
          throw new BadRequestException('authrorization 값이 누락되었습니다.');
        });

      expect(authJwtService.authorizeUserForSocket(mockSocket)).rejects.toThrow(
        'authrorization 값이 누락되었습니다.',
      );
    });

    test('토큰 검증에 실패한 경우, UnauthorizedException 반환합니다.', async () => {
      jest
        .spyOn(authJwtService, 'extractTokenFromHeader')
        .mockReturnValueOnce('Bearer accessToken');

      jest
        .spyOn(authJwtService, 'verifyBearerToken')
        .mockImplementationOnce(() => {
          throw new UnauthorizedException('토큰이 유효하지 않습니다.');
        });

      expect(authJwtService.authorizeUserForSocket(mockSocket)).rejects.toThrow(
        '토큰이 유효하지 않습니다.',
      );
    });

    test('토큰 payload에 해당하는 유저 정보를 찾을 수 없는 경우, UnauthorizedException 반환합니다.', async () => {
      jest
        .spyOn(authJwtService, 'extractTokenFromHeader')
        .mockReturnValueOnce('Bearer accessToken');

      jest.spyOn(authJwtService, 'verifyBearerToken').mockResolvedValueOnce({
        ...mockBearerTokenPayloadWithoutType,
        type: BearerTokenTypeEnum.ACCESS,
      });

      jest.spyOn(mockUsersService, 'getUserById').mockImplementationOnce(() => {
        throw new NotFoundException(
          `유저(id: ${mockUser.id})를 찾을 수 없습니다.`,
        );
      });

      expect(authJwtService.authorizeUserForSocket(mockSocket)).rejects.toThrow(
        `토큰 갱신이 필요합니다. 재로그인 해주세요.`,
      );
    });
  });
});
