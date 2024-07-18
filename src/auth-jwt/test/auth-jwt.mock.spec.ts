import { JwtService } from '@nestjs/jwt';
import { AuthJwtService } from '../auth-jwt.service';
import { JWT_SECRET } from '../const/auth-jwt.common.const';
import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/users/entities/user.entity';

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

  public readonly mockBearerToken = this.jwtService.sign(
    { ...this.mockNewUser, id: 1 },
    {
      secret: JWT_SECRET,
      expiresIn: '10m',
    },
  );

  public readonly mockAuthJwtService: Partial<AuthJwtService> = {
    login: jest.fn().mockResolvedValue({
      accessToken: this.mockBearerToken,
      refreshToken: this.mockBearerToken,
    }),
    register: jest.fn().mockResolvedValue({
      accessToken: this.mockBearerToken,
      refreshToken: this.mockBearerToken,
    }),
    extractTokenFromHeader: jest.fn().mockReturnValue(this.mockBasicToken),
    decodeBasicToken: jest.fn().mockReturnValue({
      email: this.mockNewUser.email,
      password: this.mockNewUser.password,
    }),
  };
}
