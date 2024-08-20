import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { BaseMock } from '../../common/test/base.mock';

@Injectable()
export class AuthJwtServiceMock extends BaseMock {
  public readonly mockAccessToken = 'accessToken';
  public readonly mockRefreshToken = 'refreshToken';
  public readonly mockBearerTokenPayloadWithoutType = {
    id: this.mockUser.id,
    email: this.mockUser.email,
  };

  public readonly mockJwtService: Partial<JwtService> = {
    sign: jest.fn().mockImplementation((payload) => {
      const isRefreshToken = payload.type === 'refresh';

      return isRefreshToken ? this.mockRefreshToken : this.mockAccessToken;
    }),
  };

  public readonly mockUsersService: Partial<UsersService> = {
    getUserByEmailWithPassword: jest.fn().mockReturnValue(this.mockUser),
    createUser: jest.fn().mockReturnValue(this.mockUser),
    getUserById: jest.fn().mockReturnValue(this.mockUser),
  };
}
