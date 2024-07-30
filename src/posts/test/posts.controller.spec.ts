import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { PostsControllerMock } from './posts-controller.mock';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostModel } from '../entities/post.entity';
import { UserModel } from '../../users/entities/user.entity';
import { PaginatePostsDto } from '../dtos/paginate-posts.dto';
import { RepositoryQueryOrderEnum } from '../../common/enums/repository.enum';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let mockPost: PostModel;
  let mockAuthenticatedUser: Pick<UserModel, 'id' | 'email'>;
  let mockCreatePostInfo: CreatePostDto;
  let mockUpadatePostInfo: UpdatePostDto;
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
  });

  describe('✅ PostsController >> paginatePosts: 게시물 목록 페이지네이션 조회 요청', () => {
    test('페이지 정보와 함께 게시물 목록을 반환합니다.', async () => {
      const paginateQuery: PaginatePostsDto = {
        where_likeCount_moreThan: 50,
        order_likeCount: RepositoryQueryOrderEnum.DESC,
      };

      const result = await postsController.paginatePosts(paginateQuery);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('page.cursor');
      expect(result).toHaveProperty('page.count');
      expect(result).toHaveProperty('page.nextUrl');
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
