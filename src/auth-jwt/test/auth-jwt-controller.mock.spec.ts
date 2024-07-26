import { AuthJwtService } from '../auth-jwt.service';
import { Injectable } from '@nestjs/common';
import { AuthJwtBaseMock } from './auth-jwt-base.mock.spec';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthJwtControllerMock extends AuthJwtBaseMock {
  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  public readonly mockAuthJwtService: Partial<AuthJwtService> = {
    login: jest.fn().mockResolvedValue({
      accessToken: this.mockBearerTokenForAccess,
      refreshToken: this.mockBearerTokenForRefresh,
    }),
    register: jest.fn().mockResolvedValue({
      accessToken: this.mockBearerTokenForAccess,
      refreshToken: this.mockBearerTokenForRefresh,
    }),
    extractTokenFromHeader: jest.fn(
      (authorizationHeaderValue, isBearerToken) => {
        const isRefreshToken =
          authorizationHeaderValue ===
          `Bearer ${this.mockBearerTokenForRefresh}`;

        if (isRefreshToken) {
          return this.mockBearerTokenForRefresh;
        }

        return isBearerToken
          ? this.mockBearerTokenForAccess
          : this.mockBasicToken;
      },
    ),
    decodeBasicToken: jest.fn().mockReturnValue({
      email: this.mockUserRegistrationInfo.email,
      password: this.mockUserRegistrationInfo.password,
    }),
    refreshAccessTokenUsingRefreshToken: jest.fn().mockResolvedValue({
      accessToken: this.mockBearerTokenForAccess,
    }),
  };
}
