import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';

import { AuthJwtController } from './auth-jwt.controller';
import { AuthJwtService } from './auth-jwt.service';
import { JWT_SECRET } from './constants/auth-jwt.constant';

@Module({
  imports: [JwtModule.register({ secret: JWT_SECRET }), UsersModule],
  controllers: [AuthJwtController],
  providers: [AuthJwtService],
  exports: [AuthJwtService],
})
export class AuthJwtModule {}
