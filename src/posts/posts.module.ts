import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostModel } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostModel]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
