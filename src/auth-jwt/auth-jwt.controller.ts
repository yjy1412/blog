import { Body, Controller, Post } from '@nestjs/common';
import { AuthJwtService } from './auth-jwt.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth/jwt')
export class AuthJwtController {
  constructor(private readonly authJwtService: AuthJwtService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authJwtService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authJwtService.login(loginDto);
  }
}
