import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostModel } from './entities/posts.entity';
import { CommonModule } from '../common/common.module';
import { PostCommentsModule } from './sub-modules/post-comments/post-comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel]),
    UsersModule,
    CommonModule,
    PostCommentsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
