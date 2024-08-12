import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostModel } from './entities/posts.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostModel]), UsersModule, CommonModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
