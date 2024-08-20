import { BaseMock } from '../../../../common/test/base.mock';

export class PostCommentsBaseMock extends BaseMock {
  public readonly mockPostComment = {
    id: 1,
    content: 'Test Comment',
    authorId: 1,
    postId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
}
