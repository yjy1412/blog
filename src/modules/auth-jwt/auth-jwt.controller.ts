import { Body, Controller, Headers, Post } from '@nestjs/common';

import { Public } from '../common/decorators/public.decorator';

import { AuthJwtService } from './auth-jwt.service';
import { AuthJwtRegisterDto } from './dtos/auth-jwt.register.dto';
import {
  BasicTokenHeaderType,
  BearerTokenHeaderType,
} from './types/auth-jwt.type';

@Controller('auth/jwt')
export class AuthJwtController {
  constructor(private readonly authJwtService: AuthJwtService) {}

  @Public()
  @Post('register')
  async register(@Body() body: AuthJwtRegisterDto) {
    return this.authJwtService.register(body);
  }

  @Public()
  @Post('login')
  async login(
    @Headers('authorization') headerAuthorizationValue: BasicTokenHeaderType,
  ) {
    const basicToken = this.authJwtService.extractTokenFromHeader(
      headerAuthorizationValue,
      false,
    );

    const { email, password } =
      this.authJwtService.decodeBasicToken(basicToken);

    return this.authJwtService.login({ email, password });
  }

  @Public()
  @Post('access')
  async access(
    @Headers('authorization') headerAuthorizationValue: BearerTokenHeaderType,
  ) {
    const refreshToken = this.authJwtService.extractTokenFromHeader(
      headerAuthorizationValue,
      true,
    );

    return this.authJwtService.refreshAccessTokenUsingRefreshToken(
      refreshToken,
    );
  }
}
