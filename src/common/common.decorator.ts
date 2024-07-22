import {
  ExecutionContext,
  InternalServerErrorException,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from './common.const';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const AuthenticatedUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new InternalServerErrorException(
        '인증된 유저정보를 가져올 수 없습니다.',
      );
    }
    return request.user;
  },
);
