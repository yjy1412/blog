import { JwtService } from '@nestjs/jwt';
import { AuthJwtService } from '../auth-jwt.service';
import { JWT_SECRET } from '../constants/auth-jwt.constant';
import { Injectable } from '@nestjs/common';
import { UserModel } from '../../users/entities/user.entity';
import { BearerTokenTypeEnum } from '../constants/auth-jwt.enum.constant';

@Injectable()
export class AuthJwtMock {
  constructor(private readonly jwtService: JwtService) {}

  public readonly mockNewUser: Pick<UserModel, 'email' | 'password' | 'name'> =
    {
      email: 'test@test.com',
      password: 'testPassword',
      name: {
        first: 'Hong',
        last: 'Gil-Dong',
      },
    };
  public readonly mockBasicToken = 'dGVzdEB0ZXN0LmNvbTp0ZXN0UGFzc3dvcmQ=';
  public readonly mockBearerTokenForAccess = this.mockSignBearerToken(
    BearerTokenTypeEnum.ACCESS,
    '10m',
  );
  public readonly mockBearerTokenForRefresh = this.mockSignBearerToken(
    BearerTokenTypeEnum.REFRESH,
    '10m',
  );
  public readonly mockExpiredBearerTokenForRefesh = this.mockSignBearerToken(
    BearerTokenTypeEnum.REFRESH,
    '0s',
  );
  public readonly mockAuthJwtService: Partial<AuthJwtService> = {
    login: jest.fn().mockResolvedValue({
      accessToken: this.mockBearerTokenForAccess,
      refreshToken: this.mockBearerTokenForRefresh,
    }),
    register: jest.fn().mockResolvedValue({
      accessToken: this.mockBearerTokenForAccess,
      refreshToken: this.mockBearerTokenForRefresh,
    }),
    extractTokenFromHeader: jest.fn((_, isBearerToken) => {
      return isBearerToken
        ? this.mockBearerTokenForAccess
        : this.mockBasicToken;
    }),
    decodeBasicToken: jest.fn().mockReturnValue({
      email: this.mockNewUser.email,
      password: this.mockNewUser.password,
    }),
    refreshAccessTokenUsingRefreshToken: jest.fn().mockResolvedValue({
      accessToken: this.mockBearerTokenForAccess,
    }),
  };

  /**
   * AuthJwtService.signBearerToken 메서드의 반환값을 모킹합니다.
   */
  mockSignBearerToken(tokenType: string, expiresIn: string) {
    return this.jwtService.sign(
      { ...this.mockNewUser, id: 1, type: tokenType },
      {
        secret: JWT_SECRET,
        expiresIn,
      },
    );
  }
}
