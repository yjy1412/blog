import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { UsersService } from '../../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from '../entities/post.entity';
import { UserModel } from '../../users/entities/user.entity';
import { PostsServiceMock } from './posts-service.mock.spec';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let postsService: PostsService;
  let usersService: UsersService;
  let postsRepository: Repository<PostModel>;

  let mockUser: UserModel;
  let mockPost: PostModel;
  let mockNewPost: Pick<
    PostModel,
    'title' | 'content' | 'likeCount' | 'commentCount' | 'authorId'
  >;
  let mockUpdatePost: Partial<PostModel>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsServiceMock],
    }).compile();

    const postsServiceMock = module.get<PostsServiceMock>(PostsServiceMock);

    mockUser = postsServiceMock.mockUser;
    mockPost = postsServiceMock.mockPost;
    mockNewPost = postsServiceMock.mockNewPost;
    mockUpdatePost = postsServiceMock.mockUpdatePost;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        UsersService,
        {
          provide: getRepositoryToken(PostModel),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserModel),
          useValue: Repository,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    usersService = module.get<UsersService>(UsersService);
    postsRepository = module.get<Repository<PostModel>>(
      getRepositoryToken(PostModel),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 테스트 케이스 작성
  describe('✅ PostsService >> createPost: 게시물 생성요청', () => {
    it('[FAIL] 게시물 작성자 정보가 유효하지 않은 경우 NotFoundException 에러를 반환합니다.', async () => {
      jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce(null);

      await expect(postsService.createPost(mockNewPost)).rejects.toThrow(
        'User with id 1 not found',
      );
    });

    it('[PASS] 게시물을 생성하고 반환합니다.', async () => {
      jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce(mockUser);
      jest.spyOn(postsRepository, 'create').mockReturnValueOnce(mockPost);
      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(mockPost);

      await expect(postsService.createPost(mockNewPost)).resolves.toEqual({
        ...mockPost,
        author: mockUser,
      });
    });
  });

  describe('✅ PostsService >> getPostsAll: 모든 게시물 조회요청', () => {
    it('[PASS] 모든 게시물을 조회하고 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'find').mockResolvedValueOnce([mockPost]);

      await expect(postsService.getPostsAll()).resolves.toEqual([mockPost]);
    });
  });

  describe('✅ PostsService >> getPostById: 특정 게시물 조회요청', () => {
    it('[FAIL] 조회하려는 게시물이 존재하지 않는 경우 NotFoundException 에러를 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(postsService.getPostById(1)).rejects.toThrow(
        'Post with id 1 not found',
      );
    });

    it('[PASS] 특정 게시물을 조회하고 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(mockPost);

      await expect(postsService.getPostById(1)).resolves.toEqual(mockPost);
    });
  });

  describe('✅ PostsService >> updatePostById: 특정 게시물 수정요청', () => {
    it('[FAIL] 수정하려는 게시물이 존재하지 않는 경우 NotFoundException 에러를 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        postsService.updatePostById(1, mockUpdatePost),
      ).rejects.toThrow('Post with id 1 not found');
    });

    it('[PASS] 특정 게시물을 수정하고 그 결과를 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(mockPost);
      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(mockPost);

      await expect(
        postsService.updatePostById(1, mockUpdatePost),
      ).resolves.toEqual(mockPost);
    });
  });

  describe('✅ PostsService >> deletePostById: 특정 게시물 삭제요청', () => {
    it('[PASS] 특정 게시물을 삭제하고 true를 반환합니다.', async () => {
      jest
        .spyOn(postsRepository, 'delete')
        .mockResolvedValueOnce({ raw: 1, affected: 1 });

      await expect(postsService.deletePostById(1)).resolves.toEqual(true);
    });
  });
});
