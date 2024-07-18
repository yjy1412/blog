import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthJwtService } from './auth-jwt.service';
import { RegisterDto } from './dto/register.dto';
import { BasicTokenHeaderType } from './const/auth-jwt.type.const';

@Controller('auth/jwt')
export class AuthJwtController {
  constructor(private readonly authJwtService: AuthJwtService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authJwtService.register(registerDto);
  }

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
}
