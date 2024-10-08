import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';

import { UserModel } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';

import {
  BasicTokenHeaderType,
  BearerTokenHeaderType,
} from './types/auth-jwt.type';
import {
  BasicTokenPayload,
  BearerTokenResponse,
} from './interfaces/auth-jwt.interface';
import { BearerTokenTypeEnum } from './enums/auth-jwt.enum';
import {
  BASIC_TOKEN_HEADER_PREFIX,
  BASIC_TOKEN_SEPERATOR,
  BEARER_TOKEN_HEADER_PREFIX,
  JWT_EXPIRED_TIME_FOR_ACCESS_TOKEN,
  JWT_EXPIRED_TIME_FOR_REFRESH_TOKEN,
} from './constants/auth-jwt.constant';
import {
  ENCODING_BASE64,
  ENCODING_UTF8,
} from '../common/constants/encoding.constant';
import { BearerTokenPayload } from './interfaces/auth-jwt.interface';
import { Socket } from 'socket.io';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signBearerToken(
    user: Pick<UserModel, 'id' | 'email'>,
    isRefreshToken: boolean,
  ): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      type: isRefreshToken
        ? BearerTokenTypeEnum.REFRESH
        : BearerTokenTypeEnum.ACCESS,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: isRefreshToken
        ? JWT_EXPIRED_TIME_FOR_REFRESH_TOKEN
        : JWT_EXPIRED_TIME_FOR_ACCESS_TOKEN,
    });
  }

  async authenticate(
    user: Pick<UserModel, 'email' | 'password'>,
  ): Promise<UserModel> {
    const existUser = await this.usersService.getUserByEmailWithPassword(user);

    if (!existUser) {
      throw new UnauthorizedException('이메일이 일치하지 않습니다.');
    }

    const passOk = existUser.validatePassword(user.password);
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return existUser;
  }

  async login(
    user: Pick<UserModel, 'email' | 'password'>,
  ): Promise<BearerTokenResponse> {
    const existUser = await this.authenticate(user);

    return {
      accessToken: await this.signBearerToken(existUser, false),
      refreshToken: await this.signBearerToken(existUser, true),
    };
  }

  async register(
    user: Pick<UserModel, 'email' | 'password' | 'name'>,
  ): Promise<BearerTokenResponse> {
    await this.usersService.createUser({
      ...user,
    });

    const { accessToken, refreshToken } = await this.login(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  extractTokenFromHeader(
    headerAuthorizationValue: BasicTokenHeaderType | BearerTokenHeaderType,
    isBearerToken: boolean,
  ): string {
    if (!headerAuthorizationValue) {
      throw new UnauthorizedException('authrorization 값이 누락되었습니다.');
    }

    const splitValue = headerAuthorizationValue.split(' ');

    if (splitValue.length !== 2) {
      throw new UnauthorizedException(
        'authorization 형식이 올바르지 않습니다.',
      );
    }

    const [prefix, token] = splitValue;

    const expectedPrefix = isBearerToken
      ? BEARER_TOKEN_HEADER_PREFIX
      : BASIC_TOKEN_HEADER_PREFIX;

    if (prefix !== expectedPrefix) {
      throw new UnauthorizedException('authorization 값이 올바르지 않습니다.');
    }

    if (!token || token === 'null') {
      throw new UnauthorizedException(
        'authorization 헤더에 토큰 값이 누락되었습니다.',
      );
    }

    return token;
  }

  decodeBasicToken(basicToken: string): BasicTokenPayload {
    const decodedToken = Buffer.from(basicToken, ENCODING_BASE64)
      .toString(ENCODING_UTF8)
      .split(BASIC_TOKEN_SEPERATOR);

    if (decodedToken.length !== 2) {
      throw new UnauthorizedException('토큰 형식이 올바르지 않습니다.');
    }

    const [email, password] = decodedToken;

    return { email, password };
  }

  async verifyBearerToken(
    token: string,
    isRefreshToken: boolean,
  ): Promise<BearerTokenPayload> {
    let decodedToken: any;
    try {
      decodedToken = await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    if (_.hasIn(BearerTokenTypeEnum, decodedToken.type)) {
      throw new UnauthorizedException('토큰 형식이 올바르지 않습니다.');
    }

    const expectedDecodedTokenType = isRefreshToken
      ? BearerTokenTypeEnum.REFRESH
      : BearerTokenTypeEnum.ACCESS;

    if (decodedToken.type !== expectedDecodedTokenType) {
      throw new UnauthorizedException('토큰의 정보가 유효하지 않습니다.');
    }

    return decodedToken;
  }

  async refreshAccessTokenUsingRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const user: Pick<UserModel, 'id' | 'email'> = await this.verifyBearerToken(
      refreshToken,
      true,
    );

    return {
      accessToken: await this.signBearerToken(user, false),
    };
  }

  async authorizeUserForSocket(socket: Socket & { user: any }) {
    const accessToken = this.extractTokenFromHeader(
      socket.handshake.headers.authorization as BearerTokenHeaderType,
      true,
    );

    const payload = await this.verifyBearerToken(accessToken, false);

    try {
      const user = await this.usersService.getUserById(payload.id);

      socket.user = user;
    } catch (err) {
      throw new UnauthorizedException(
        `토큰 갱신이 필요합니다. 재로그인 해주세요.`,
      );
    }

    return true;
  }
}
