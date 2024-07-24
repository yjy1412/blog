import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { PostsControllerMock } from './posts-controller.mock.spec';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostModel } from '../entities/post.entity';
import { UserModel } from '../../users/entities/user.entity';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let controller: PostsController;

  let mockPost: PostModel;
  let mockAuthenticatedUser: Pick<UserModel, 'id' | 'email'>;
  let mockCreatePostDto: CreatePostDto;
  let mockUpadatePostDto: UpdatePostDto;
  let mockPostsService: Partial<PostsService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsControllerMock],
    }).compile();

    const postsControllerMock =
      module.get<PostsControllerMock>(PostsControllerMock);

    mockPost = postsControllerMock.mockPost;
    mockAuthenticatedUser = postsControllerMock.mockAuthenticatedUser;
    mockCreatePostDto = postsControllerMock.mockCreatePostDto;
    mockUpadatePostDto = postsControllerMock.mockUpadatePostDto;
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

    controller = module.get<PostsController>(PostsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ PostsController >> createPost: 게시물 생성요청', () => {
    it('[PASS] 게시물을 생성하고 반환합니다.', async () => {
      const result = await controller.createPost(
        mockAuthenticatedUser,
        mockCreatePostDto,
      );
      expect(result).toEqual(mockPost);
    });
  });

  describe('✅ PostsController >> getPostsAll: 모든 게시물 조회요청', () => {
    it('[PASS] 모든 게시물을 조회하고 반환합니다.', async () => {
      const result = await controller.getPostsAll();
      expect(result).toEqual([mockPost]);
    });
  });

  describe('✅ PostsController >> getPostById: 특정 게시물 조회요청', () => {
    it('[PASS] 특정 게시물을 조회하고 반환합니다.', async () => {
      const result = await controller.getPostById(1);
      expect(result).toEqual(mockPost);
    });
  });

  describe('✅ PostsController >> updatePostById: 특정 게시물 수정요청', () => {
    it('[PASS] 특정 게시물을 수정하고 반환합니다.', async () => {
      const result = await controller.updatePostById(1, mockUpadatePostDto);
      expect(result).toEqual(mockPost);
    });
  });

  describe('✅ PostsController >> deletePostById: 특정 게시물 삭제요청', () => {
    it('[PASS] 특정 게시물을 삭제하고 반환합니다.', async () => {
      const result = await controller.deletePostById(1);
      expect(result).toEqual(true);
    });
  });
});
