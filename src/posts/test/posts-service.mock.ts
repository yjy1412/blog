import { Injectable } from '@nestjs/common';

import { PostModel } from '../entities/post.entity';
import { BaseMock } from '../../common/test/base.mock';
import { UsersService } from '../../users/users.service';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatePostsDto } from '../dtos/paginate-posts.dto';
import { RepositoryQueryOrderEnum } from '../../common/enums/repository.enum';

@Injectable()
export class PostsServiceMock extends BaseMock {
  public readonly mockNewPost: Pick<
    PostModel,
    'title' | 'content' | 'likeCount' | 'commentCount' | 'authorId'
  > = {
    title: 'Test Post',
    content: 'Test Content',
    likeCount: 0,
    commentCount: 0,
    authorId: 1,
  };

  public readonly mockUpdatePost: Partial<PostModel> = {
    title: 'Test Update Post',
    content: 'Test Update Content',
  };

  public readonly mockPaginatePostsDto: PaginatePostsDto = {
    page: 1,
    take: 10,
    where_likeCount_moreThan: 50,
    order_likeCount: RepositoryQueryOrderEnum.DESC,
  };

  public readonly mockUsersService: Partial<UsersService> = {
    getUserById: jest.fn().mockResolvedValue(this.mockUser),
  };

  public readonly mockPaginationService: Partial<PaginationService> = {
    paginate: jest.fn().mockResolvedValue({
      data: [this.mockPost],
      page: {
        currentPage: 1,
        totalCount: 1,
      },
    }),
  };
}
