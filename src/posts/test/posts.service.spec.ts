import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { UsersService } from '../../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from '../entities/post.entity';
import { PostsServiceMock } from './posts-service.mock';
import { PaginatePostsDto } from '../dtos/paginate-posts.dto';
import { RepositoryQueryOrderEnum } from '../../common/enums/repository.enum';
import { PaginationService } from '../../common/services/pagination.service';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let mockPost: PostModel;
  let mockNewPost: Pick<
    PostModel,
    'title' | 'content' | 'likeCount' | 'commentCount' | 'authorId'
  >;
  let mockUpdatePost: Partial<PostModel>;
  let mockUsersService: Partial<UsersService>;
  let mockCommonService: Partial<PaginationService>;

  let postsService: PostsService;
  let commonService: PaginationService;
  let usersService: UsersService;
  let postsRepository: Repository<PostModel>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsServiceMock],
    }).compile();

    const postsServiceMock = module.get<PostsServiceMock>(PostsServiceMock);

    mockPost = postsServiceMock.mockPost;
    mockNewPost = postsServiceMock.mockNewPost;
    mockUpdatePost = postsServiceMock.mockUpdatePost;
    mockUsersService = postsServiceMock.mockUsersService;
    mockCommonService = postsServiceMock.mockCommonService;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PaginationService,
          useValue: mockCommonService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(PostModel),
          useClass: Repository,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    commonService = module.get<PaginationService>(PaginationService);
    usersService = module.get<UsersService>(UsersService);
    postsRepository = module.get<Repository<PostModel>>(
      getRepositoryToken(PostModel),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ PostsService >> createPost: 게시물 생성요청', () => {
    it('게시물 작성자 정보가 유효하지 않은 경우 NotFoundException 에러를 반환합니다.', async () => {
      jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce(null);

      await expect(postsService.createPost(mockNewPost)).rejects.toThrow(
        'User with id 1 not found',
      );
    });

    it('게시물을 생성하고 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'create').mockReturnValueOnce(mockPost);
      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(mockPost);

      await expect(postsService.createPost(mockNewPost)).resolves.toEqual({
        ...mockPost,
      });
    });
  });

  describe('✅ PostsService >> paginatePosts: 게시물 페이지네이션 목록 조회', () => {
    it('paginate 함수에 path, paginateQuery, repository를 전달해야 합니다.', async () => {
      jest.spyOn(postsRepository, 'find').mockResolvedValueOnce([mockPost]);

      const path = 'posts/page';
      const paginateQuery: PaginatePostsDto = {
        where_likeCount_moreThan: 50,
        order_likeCount: RepositoryQueryOrderEnum.DESC,
      };

      await postsService.paginatePosts(paginateQuery, path);

      expect(commonService.paginate).toHaveBeenCalledWith(
        path,
        paginateQuery,
        postsRepository,
      );
    });

    it('응답 결과에 페이지네이션 메타정보가 함께 포함되어야 합니다', async () => {
      jest.spyOn(postsRepository, 'find').mockResolvedValueOnce([mockPost]);

      const path = 'posts/page';
      const paginateQuery: PaginatePostsDto = {
        where_likeCount_moreThan: 50,
        order_likeCount: RepositoryQueryOrderEnum.DESC,
      };

      const response = await postsService.paginatePosts(paginateQuery, path);

      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('page');
      expect(response).toHaveProperty('page.cursor');
      expect(response).toHaveProperty('page.count');
      expect(response).toHaveProperty('page.nextUrl');
    });
  });

  describe('✅ PostsService >> getPostById: 특정 게시물 조회요청', () => {
    it('조회하려는 게시물이 존재하지 않는 경우 NotFoundException 에러를 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(postsService.getPostById(1)).rejects.toThrow(
        'Post with id 1 not found',
      );
    });

    it('특정 게시물을 조회하고 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(mockPost);

      await expect(postsService.getPostById(1)).resolves.toEqual(mockPost);
    });
  });

  describe('✅ PostsService >> updatePostById: 특정 게시물 수정요청', () => {
    it('수정하려는 게시물이 존재하지 않는 경우 NotFoundException 에러를 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        postsService.updatePostById(1, mockUpdatePost),
      ).rejects.toThrow('Post with id 1 not found');
    });

    it('특정 게시물을 수정하고 그 결과를 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(mockPost);
      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(mockPost);

      await expect(
        postsService.updatePostById(1, mockUpdatePost),
      ).resolves.toEqual(mockPost);
    });
  });

  describe('✅ PostsService >> deletePostById: 특정 게시물 삭제요청', () => {
    it('특정 게시물을 삭제하고 true를 반환합니다.', async () => {
      jest
        .spyOn(postsRepository, 'delete')
        .mockResolvedValueOnce({ raw: 1, affected: 1 });

      await expect(postsService.deletePostById(1)).resolves.toEqual(true);
    });
  });
});
