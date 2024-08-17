import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { BearerTokenPayload } from '../../auth-jwt/interfaces/auth-jwt.interface';

export const AuthenticatedUser = createParamDecorator(
  (data, context: ExecutionContext): BearerTokenPayload => {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new InternalServerErrorException(
        '인증된 유저정보를 가져올 수 없습니다.',
      );
    }
    return request.user;
  },
);
