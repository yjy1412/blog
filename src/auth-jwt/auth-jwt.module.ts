import { Module } from '@nestjs/common';
import { AuthJwtService } from './auth-jwt.service';
import { AuthJwtController } from './auth-jwt.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JWT_SECRET } from './constants/auth-jwt.common.constant';

@Module({
  imports: [JwtModule.register({ secret: JWT_SECRET }), UsersModule],
  controllers: [AuthJwtController],
  providers: [AuthJwtService],
  exports: [AuthJwtService],
})
export class AuthJwtModule {}
