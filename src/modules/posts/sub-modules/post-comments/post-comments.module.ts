import { Module } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import { PostCommentsController } from './post-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentModel } from './entities/post-comments.entity';
import { AuthJwtModule } from '../../../auth-jwt/auth-jwt.module';
import { PostCommentsGateway } from './post-comments.gateway';
import { CommonModule } from '../../../common/common.module';
import { PostModel } from '../../entities/posts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostCommentModel, PostModel]),
    AuthJwtModule,
    CommonModule,
  ],
  controllers: [PostCommentsController],
  providers: [PostCommentsService, PostCommentsGateway],
})
export class PostCommentsModule {}
