import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let postsService: PostsService;
  let usersService: UsersService;

  let postsRepository: Repository<PostModel>;

  // 테스트 전 실행
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        UsersService,
        {
          provide: getRepositoryToken(PostModel),
          useValue: Repository,
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

  const mockCreatePostDto: CreatePostDto = {
    title: 'Test Post',
    content: 'Test Content',
    likeCount: 0,
    commentCount: 0,
    authorId: 1,
  };

  const mockUser: UserModel = {
    id: 1,
    email: 'tester@test.com',
    password: 'testPassword',
    name: {
      first: 'Hong',
      last: 'Gil-Dong',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  };

  const mockPost: PostModel = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: mockUser,
  };

  // 테스트 케이스 작성
  describe('✅ PostsService >> createPost: 게시물 생성요청', () => {
    it('[FAIL] 게시물 작성자 정보가 유효하지 않은 경우 NotFoundException 에러를 반환합니다.', async () => {
      usersService.getUserById = jest.fn().mockResolvedValue(null);

      await expect(postsService.createPost(mockCreatePostDto)).rejects.toThrow(
        'User with id 1 not found',
      );
    });

    it('[PASS] 게시물을 생성하고 반환합니다.', async () => {
      usersService.getUserById = jest.fn().mockResolvedValue(mockUser);
      postsRepository.create = jest.fn().mockReturnValue(mockPost);
      postsRepository.save = jest.fn().mockResolvedValue(mockPost);

      await expect(postsService.createPost(mockCreatePostDto)).resolves.toEqual(
        {
          ...mockPost,
          author: mockUser,
        },
      );
    });
  });

  describe('✅ PostsService >> getPostsAll: 모든 게시물 조회요청', () => {
    it('[PASS] 모든 게시물을 조회하고 반환합니다.', async () => {
      postsRepository.find = jest.fn().mockResolvedValue([mockPost]);

      await expect(postsService.getPostsAll()).resolves.toEqual([mockPost]);
    });
  });

  describe('✅ PostsService >> getPostById: 특정 게시물 조회요청', () => {
    it('[FAIL] 조회하려는 게시물이 존재하지 않는 경우 NotFoundException 에러를 반환합니다.', async () => {
      postsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(postsService.getPostById(1)).rejects.toThrow(
        'Post with id 1 not found',
      );
    });

    it('[PASS] 특정 게시물을 조회하고 반환합니다.', async () => {
      postsRepository.findOne = jest.fn().mockResolvedValue(mockPost);

      await expect(postsService.getPostById(1)).resolves.toEqual(mockPost);
    });
  });

  describe('✅ PostsService >> updatePostById: 특정 게시물 수정요청', () => {
    it('[FAIL] 수정하려는 게시물이 존재하지 않는 경우 NotFoundException 에러를 반환합니다.', async () => {
      postsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        postsService.updatePostById(1, mockCreatePostDto),
      ).rejects.toThrow('Post with id 1 not found');
    });

    it('[PASS] 특정 게시물을 수정하고 그 결과를 반환합니다.', async () => {
      postsRepository.findOne = jest.fn().mockResolvedValue(mockPost);
      postsRepository.save = jest.fn().mockResolvedValue(mockPost);

      await expect(
        postsService.updatePostById(1, mockCreatePostDto),
      ).resolves.toEqual(mockPost);
    });
  });

  describe('✅ PostsService >> deletePostById: 특정 게시물 삭제요청', () => {
    it('[PASS] 특정 게시물을 삭제하고 true를 반환합니다.', async () => {
      postsRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      await expect(postsService.deletePostById(1)).resolves.toEqual(true);
    });
  });
});
