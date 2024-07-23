import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthJwtService } from '../auth-jwt.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/common.constant';

@Injectable()
export class AuthJwtGuard implements CanActivate {
  constructor(
    private readonly authJwtService: AuthJwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

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
