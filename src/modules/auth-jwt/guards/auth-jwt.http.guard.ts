import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { METADATA_IS_PUBLIC_KEY } from '../../common/constants/metadata.constant';

import { AuthJwtService } from '../auth-jwt.service';

@Injectable()
export class AuthJwtHttpGuard implements CanActivate {
  constructor(
    private readonly authJwtService: AuthJwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      METADATA_IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const accessToken = this.authJwtService.extractTokenFromHeader(
      request.headers.authorization,
      true,
    );

    const payload = this.authJwtService.verifyBearerToken(accessToken, false);

    request.user = payload;

    return true;
  }
}
