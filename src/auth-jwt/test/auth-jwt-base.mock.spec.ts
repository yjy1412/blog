import { UserModel } from '../../users/entities/user.entity';
import { BearerTokenTypeEnum } from '../constants/auth-jwt.enum.constant';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export abstract class AuthJwtBaseMock {
  constructor(private readonly jwtService: JwtService) {}
  public readonly mockUserRegistrationInfo: Pick<
    UserModel,
    'email' | 'password' | 'name'
  > = {
    email: 'test@test.com',
    password: 'testPassword',
    name: {
      first: 'Hong',
      last: 'Gil-Dong',
    },
  };

  public readonly mockUser: UserModel = {
    ...this.mockUserRegistrationInfo,
    id: 1,
    password: bcrypt.hashSync(this.mockUserRegistrationInfo.password, 10),
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  };

  public readonly mockBearerTokenPayloadWithoutType = {
    id: this.mockUser.id,
    email: this.mockUser.email,
  };

  public readonly mockBasicToken = Buffer.from(
    `${this.mockUser.email}:${this.mockUser.password}`,
  ).toString('base64');

  public readonly mockBearerTokenForAccess = this.jwtService.sign(
    {
      ...this.mockBearerTokenPayloadWithoutType,
      type: BearerTokenTypeEnum.ACCESS,
    },
    {
      expiresIn: '10m',
    },
  );

  public readonly mockBearerTokenForRefresh = this.jwtService.sign(
    {
      ...this.mockBearerTokenPayloadWithoutType,
      type: BearerTokenTypeEnum.REFRESH,
    },
    {
      expiresIn: '10m',
    },
  );

  public readonly mockExpiredBearerTokenForRefesh = this.jwtService.sign(
    {
      ...this.mockBearerTokenPayloadWithoutType,
      type: BearerTokenTypeEnum.REFRESH,
    },
    {
      expiresIn: '0m',
    },
  );
}
