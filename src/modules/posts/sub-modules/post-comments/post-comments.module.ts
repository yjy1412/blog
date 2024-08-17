import { Module } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import { PostCommentsController } from './post-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentModel } from './entities/post-comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostCommentModel])],
  controllers: [PostCommentsController],
  providers: [PostCommentsService],
})
export class PostCommentsModule {}
