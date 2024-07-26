import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { AuthJwtBaseMock } from './auth-jwt-base.mock.spec';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthJwtServiceMock extends AuthJwtBaseMock {
  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  public readonly mockJwtService: Partial<JwtService> = {
    sign: jest.fn().mockImplementation((payload) => {
      const isRefreshToken = payload.type === 'refresh';

      return isRefreshToken
        ? this.mockBearerTokenForRefresh
        : this.mockBearerTokenForAccess;
    }),
    // verify: jest.fn().mockReturnValue(this.mockNewUser),
  };

  public readonly mockUsersService: Partial<UsersService> = {
    getUserByEmail: jest.fn().mockReturnValue(this.mockUser),
    createUser: jest.fn().mockReturnValue(this.mockUser),
  };
}
