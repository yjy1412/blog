import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';

import { AuthJwtController } from './auth-jwt.controller';
import { AuthJwtService } from './auth-jwt.service';
import { ENV_JWT_SECRET_KEY } from '../common/constants/env-keys.constant';

config();
@Module({
  imports: [
    JwtModule.register({ secret: process.env[ENV_JWT_SECRET_KEY] }),
    UsersModule,
  ],
  controllers: [AuthJwtController],
  providers: [AuthJwtService],
  exports: [AuthJwtService],
})
export class AuthJwtModule {}
