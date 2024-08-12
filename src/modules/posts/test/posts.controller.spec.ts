import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { PostsControllerMock } from './posts.controller.mock';
import { PostsCreatePostDto } from '../dtos/posts.create-post.dto';
import { PostsUpdatePostDto } from '../dtos/posts.update-post.dto';
import { PostModel } from '../entities/posts.entity';
import { UserModel } from '../../users/entities/user.entity';
import { PostsPaginatePostsDto } from '../dtos/posts.paginate-posts.dto';
import { RepositoryQueryOrderEnum } from '../../common/enums/repository.enum';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let mockPost: PostModel;
  let mockAuthenticatedUser: Pick<UserModel, 'id' | 'email'>;
  let mockCreatePostInfo: PostsCreatePostDto;
  let mockUpadatePostInfo: PostsUpdatePostDto;
  let mockPostsService: Partial<PostsService>;

  let postsController: PostsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsControllerMock],
    }).compile();

    const postsControllerMock =
      module.get<PostsControllerMock>(PostsControllerMock);

    mockPost = postsControllerMock.mockPost;
    mockAuthenticatedUser = postsControllerMock.mockAuthenticatedUser;
    mockCreatePostInfo = postsControllerMock.mockCreatePostInfo;
    mockUpadatePostInfo = postsControllerMock.mockUpadatePostInfo;
    mockPostsService = postsControllerMock.mockPostsService;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ PostsController >> createPost: 게시물 생성요청', () => {
    test('게시물을 생성하고 반환합니다.', async () => {
      const result = await postsController.createPost(
        mockAuthenticatedUser,
        mockCreatePostInfo,
      );

      expect(result).toEqual(mockPost);
    });

    test('이미지 업로드가 포함된 경우, 이미지를 저장합니다.', async () => {
      const mockImages = ['test.jpg', 'test2.jpg'];
      const mockCreatPostDtoWithImages = {
        ...mockCreatePostInfo,
        images: mockImages,
      };

      await postsController.createPost(
        mockAuthenticatedUser,
        mockCreatPostDtoWithImages,
      );

      expect(mockPostsService.savePostImages).toHaveBeenCalledWith(mockImages);
    });
  });

  describe('✅ PostsController >> paginatePosts: 게시물 목록 페이지네이션 조회 요청', () => {
    test('페이지 메타정보 생성을 위해, router path 정보를 조회 서비스 로직에 전달해야 합니다.', async () => {
      const paginationQuery: PostsPaginatePostsDto = {
        where_likeCount_moreThanOrEqual: 50,
        order_likeCount: RepositoryQueryOrderEnum.DESC,
      };

      await postsController.paginatePosts(paginationQuery);

      expect(mockPostsService.paginatePosts).toHaveBeenCalledWith(
        paginationQuery,
      );
    });

    test('페이지 정보와 함께 게시물 목록을 반환합니다.', async () => {
      const paginationQuery: PostsPaginatePostsDto = {
        where_likeCount_moreThanOrEqual: 50,
        order_likeCount: RepositoryQueryOrderEnum.DESC,
      };

      const result = await postsController.paginatePosts(paginationQuery);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('page.currentPage');
      expect(result).toHaveProperty('page.totalCount');
    });
  });

  describe('✅ PostsController >> getPostById: 특정 게시물 조회요청', () => {
    test('특정 게시물을 조회하고 반환합니다.', async () => {
      const result = await postsController.getPostById(1);
      expect(result).toEqual(mockPost);
    });
  });

  describe('✅ PostsController >> updatePostById: 특정 게시물 수정요청', () => {
    test('특정 게시물을 수정하고 반환합니다.', async () => {
      const result = await postsController.updatePostById(
        1,
        mockUpadatePostInfo,
      );
      expect(result).toEqual(mockPost);
    });
  });

  describe('✅ PostsController >> deletePostById: 특정 게시물 삭제요청', () => {
    test('특정 게시물을 삭제하고 반환합니다.', async () => {
      const result = await postsController.deletePostById(1);
      expect(result).toEqual(true);
    });
  });
});
