import { Injectable } from '@nestjs/common';
import { PostCommentsBaseMock } from './post-comments.base.mock';
import { PostCommentsService } from '../post-comments.service';
import { PostCommentsGateway } from '../post-comments.gateway';

@Injectable()
export class PostCommentsControllerMock extends PostCommentsBaseMock {
  public readonly mockPostCommentsService: Partial<PostCommentsService> = {
    createPostComment: jest.fn(),
    deleteMyPostComment: jest.fn(),
  };

  public readonly mockPostCommentsGateway: Partial<PostCommentsGateway> = {
    sendMessageForPostCommentCreated: jest.fn(),
  };
}
