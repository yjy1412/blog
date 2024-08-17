import { Body, Controller, Post } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import { PostCommentsCreateCommentDto } from './dtos/post-comments.create-comment.dto';
import { AuthenticatedUser } from '../../../common/decorators/authenticate-user.decorator';
import { BearerTokenPayload } from '../../../auth-jwt/interfaces/auth-jwt.interface';

@Controller('posts/:postId/comments')
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  @Post()
  createComment(
    @Body() body: PostCommentsCreateCommentDto,
    @AuthenticatedUser() user: BearerTokenPayload,
  ) {
    return this.postCommentsService.createComment(user.id, body);
  }
}
