import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JWT_SECRET } from './const/auth-jwt.common.const';
import * as bcrypt from 'bcrypt';
import {
  BasicTokenHeaderType,
  BearerTokenHeaderType,
} from './const/auth-jwt.type.const';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 유저의 email과 id를 받아 Bearer token을 발급
   */
  signBearerToken(
    user: Pick<UserModel, 'email' | 'id'>,
    isRefreshToken: boolean,
  ) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? '1d' : '1h',
    });
  }

  /**
   * 유저의 email과 password를 받아 인증
   */
  async authenticate(user: Pick<UserModel, 'email' | 'password'>) {
    const existUser = await this.usersService.getUserByEmail(user);

    if (!existUser) {
      throw new UnauthorizedException('이메일이 일치하지 않습니다.');
    }

    const passOk = bcrypt.compareSync(user.password, existUser.password);
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return existUser;
  }

  /**
   * 로그인
   *
   *   1. 유저의 email과 password를 받아 인증
   *   2. 액세스 / 리프레쉬 토큰 발급
   */
  async login(user: Pick<UserModel, 'email' | 'password'>) {
    const existUser = await this.authenticate(user);

    return {
      accessToken: this.signBearerToken(existUser, false),
      refreshToken: this.signBearerToken(existUser, true),
    };
  }

  /**
   * 회원가입
   *
   *  1. 유저의 email, password, name을 받아 유저정보 생성
   *  2. 로그인 처리
   */
  async register(user: Pick<UserModel, 'email' | 'password' | 'name'>) {
    await this.usersService.createUser({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    });

    const { accessToken, refreshToken } = await this.login(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 요청 헤더 authorization에서 토큰 추출
   *
   * BasicTokenHeaderType: { "authorization": "Basic ${token}"}
   * BearerTokenHeaderType: { "authorization": "Bearer ${token}"}
   */
  extractTokenFromHeader(
    headerAuthorizationValue: BasicTokenHeaderType | BearerTokenHeaderType,
    isBearerToken: boolean,
  ) {
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
    const expectedPrefix = isBearerToken ? 'Bearer' : 'Basic';

    if (prefix !== expectedPrefix) {
      throw new UnauthorizedException('authorization 값이 올바르지 않습니다.');
    }

    return token;
  }

  /**
   * base64로 인코딩된 basicToken('email:password')에서 email과 password를 추출
   */
  decodeBasicToken(basicToken: string) {
    const decodedToken = Buffer.from(basicToken, 'base64')
      .toString('utf-8')
      .split(':');

    if (decodedToken.length !== 2) {
      throw new UnauthorizedException('토큰 형식이 올바르지 않습니다.');
    }

    const [email, password] = decodedToken;

    return { email, password };
  }
}
