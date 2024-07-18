import { JwtService } from '@nestjs/jwt';
import { AuthJwtService } from '../auth-jwt.service';
import { JWT_SECRET } from '../const/auth-jwt.const';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthJwtMock {
  constructor(private readonly jwtService: JwtService) {}

  public readonly mockNewUser = {
    email: 'test@test.com',
    password: 'testPassword',
    name: {
      first: 'Hong',
      last: 'Gil-Dong',
    },
  };

  public readonly mockToken = this.jwtService.sign(
    { ...this.mockNewUser, id: 1 },
    {
      secret: JWT_SECRET,
      expiresIn: '10m',
    },
  );

  public readonly mockAuthJwtService: Partial<AuthJwtService> = {
    login: jest.fn(),
    register: jest.fn().mockResolvedValue({
      accessToken: this.mockToken,
      refreshToken: this.mockToken,
    }),
  };
}
