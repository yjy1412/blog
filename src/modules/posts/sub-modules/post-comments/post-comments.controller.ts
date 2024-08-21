import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import { PostCommentsCreateCommentDto } from './dtos/post-comments.create-comment.dto';
import { AuthenticatedUser } from '../../../common/decorators/authenticate-user.decorator';
import { BearerTokenPayload } from '../../../auth-jwt/interfaces/auth-jwt.interface';
import { PostCommentsGateway } from './post-comments.gateway';

@Controller('posts/:postId/comments')
export class PostCommentsController {
  constructor(
    private readonly postCommentsService: PostCommentsService,
    private readonly postCommentsGateway: PostCommentsGateway,
  ) {}

  @Post()
  async createPostComment(
    @Body() body: PostCommentsCreateCommentDto,
    @AuthenticatedUser() user: BearerTokenPayload,
  ) {
    const newPostComment = await this.postCommentsService.createPostComment(
      user.id,
      body,
    );

    this.postCommentsGateway.sendMessageForPostCommentCreated(
      newPostComment.postId,
      newPostComment.id,
    );

    return newPostComment;
  }

  @Delete(':id')
  async deleteMyPostComment(
    @Param('id', ParseIntPipe) id: number,
    @AuthenticatedUser() user: BearerTokenPayload,
  ) {
    const deletedPostComment =
      await this.postCommentsService.deleteMyPostComment(user.id, id);

    if (deletedPostComment) {
      this.postCommentsGateway.sendMessageForPostCommentDeleted(user.id, id);
    }

    return true;
  }
}
