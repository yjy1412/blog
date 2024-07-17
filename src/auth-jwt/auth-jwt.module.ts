import { Module } from '@nestjs/common';
import { AuthJwtService } from './auth-jwt.service';
import { AuthJwtController } from './auth-jwt.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthJwtController],
  providers: [AuthJwtService],
})
export class AuthJwtModule {}
