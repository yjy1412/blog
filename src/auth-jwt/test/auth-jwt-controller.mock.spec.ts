import { AuthJwtService } from '../auth-jwt.service';
import { Injectable } from '@nestjs/common';
import { BaseMock } from '../../common/test/base.mock.spec';

@Injectable()
export class AuthJwtControllerMock extends BaseMock {
  public readonly mockAccessToken = 'accessToken';
  public readonly mockRefreshToken = 'refreshToken';
  public readonly mockExiredRefreshToken = 'expiredRefreshToken';
  public readonly mockBasicToken = Buffer.from(
    `${this.mockUserRegistrationInfo.email}:${this.mockUserRegistrationInfo.password}`,
  ).toString('base64');

  public readonly mockAuthJwtService: Partial<AuthJwtService> = {
    login: jest.fn().mockResolvedValue({
      accessToken: this.mockAccessToken,
      refreshToken: this.mockRefreshToken,
    }),
    register: jest.fn().mockResolvedValue({
      accessToken: this.mockAccessToken,
      refreshToken: this.mockRefreshToken,
    }),
    extractTokenFromHeader: jest.fn(
      (authorizationHeaderValue, isBearerToken) => {
        if (!isBearerToken) {
          return this.mockBasicToken;
        }

        const isRefreshToken =
          authorizationHeaderValue === `Bearer ${this.mockRefreshToken}`;

        return isRefreshToken ? this.mockRefreshToken : this.mockAccessToken;
      },
    ),
    decodeBasicToken: jest.fn().mockReturnValue({
      email: this.mockUserRegistrationInfo.email,
      password: this.mockUserRegistrationInfo.password,
    }),
    refreshAccessTokenUsingRefreshToken: jest.fn().mockResolvedValue({
      accessToken: this.mockAccessToken,
    }),
  };
}
