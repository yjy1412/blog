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
import { promises as fs } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { PATH_FROM_PUBLIC_TO_POST_IMAGE } from '../../common/constants/path.constant';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let mockPost: PostModel;
  let mockNewPost: Pick<
    PostModel,
    'title' | 'content' | 'likeCount' | 'commentCount' | 'authorId'
  >;
  let mockUpdatePost: Partial<PostModel>;
  let mockUsersService: Partial<UsersService>;
  let mockPaginationService: Partial<PaginationService>;

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
    mockPaginationService = postsServiceMock.mockPaginationService;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PaginationService,
          useValue: mockPaginationService,
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
    test('게시물 작성자 정보가 유효하지 않은 경우 NotFoundException 에러를 반환합니다.', async () => {
      jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce(null);

      const mockAuthorId = 1;

      await expect(
        postsService.createPost(mockAuthorId, mockNewPost),
      ).rejects.toThrow('User with id 1 not found');
    });

    test('게시물을 생성하고 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'create').mockReturnValueOnce(mockPost);
      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(mockPost);

      const mockAuthorId = 1;

      await expect(
        postsService.createPost(mockAuthorId, mockNewPost),
      ).resolves.toEqual({
        ...mockPost,
      });
    });
  });

  describe('✅ PostsService >> paginatePosts: 게시물 페이지네이션 목록 조회', () => {
    test('paginate 함수에 paginateQuery, repository를 전달해야 합니다.', async () => {
      jest.spyOn(postsRepository, 'find').mockResolvedValueOnce([mockPost]);

      const paginateQuery: PaginatePostsDto = {
        where_likeCount_moreThanOrEqual: 50,
        order_likeCount: RepositoryQueryOrderEnum.DESC,
      };

      await postsService.paginatePosts(paginateQuery);

      expect(commonService.paginate).toHaveBeenCalledWith(
        paginateQuery,
        postsRepository,
      );
    });

    test('응답 결과에 페이지네이션 메타정보가 함께 포함되어야 합니다', async () => {
      jest.spyOn(postsRepository, 'find').mockResolvedValueOnce([mockPost]);

      const paginateQuery: PaginatePostsDto = {
        where_likeCount_moreThanOrEqual: 50,
        order_likeCount: RepositoryQueryOrderEnum.DESC,
      };

      const response = await postsService.paginatePosts(paginateQuery);

      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('page');
      expect(response.page).toHaveProperty('currentPage');
      expect(response.page).toHaveProperty('totalCount');
    });
  });

  describe('✅ PostsService >> getPostById: 특정 게시물 조회요청', () => {
    test('조회하려는 게시물이 존재하지 않는 경우 NotFoundException 에러를 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(postsService.getPostById(1)).rejects.toThrow(
        'Post with id 1 not found',
      );
    });

    test('특정 게시물을 조회하고 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(mockPost);

      await expect(postsService.getPostById(1)).resolves.toEqual(mockPost);
    });
  });

  describe('✅ PostsService >> updatePostById: 특정 게시물 수정요청', () => {
    test('수정하려는 게시물이 존재하지 않는 경우 NotFoundException 에러를 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        postsService.updatePostById(1, mockUpdatePost),
      ).rejects.toThrow('Post with id 1 not found');
    });

    test('특정 게시물을 수정하고 그 결과를 반환합니다.', async () => {
      jest.spyOn(postsRepository, 'findOne').mockResolvedValueOnce(mockPost);
      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(mockPost);

      await expect(
        postsService.updatePostById(1, mockUpdatePost),
      ).resolves.toEqual(mockPost);
    });
  });

  describe('✅ PostsService >> deletePostById: 특정 게시물 삭제요청', () => {
    test('특정 게시물을 삭제하고 true를 반환합니다.', async () => {
      jest
        .spyOn(postsRepository, 'delete')
        .mockResolvedValueOnce({ raw: 1, affected: 1 });

      await expect(postsService.deletePostById(1)).resolves.toEqual(true);
    });
  });

  describe('✅ PostsService >> savePostImages: 게시물 이미지 저장', () => {
    test('이미지 파일을 찾을 수 없는 경우 에러를 반환합니다.', async () => {
      jest
        .spyOn(fs, 'access')
        .mockRejectedValueOnce(new Error('File does not exist'));

      const mockImages = ['image1.jpg', 'image2.png'];

      await expect(postsService.savePostImages(mockImages)).rejects.toThrow(
        BadRequestException,
      );
    });

    test('반환되는 이미지 파일 경로가 유효해야 합니다.', async () => {
      jest.spyOn(fs, 'access').mockResolvedValue();
      jest.spyOn(fs, 'rename').mockResolvedValue();

      const mockImages = ['image1.jpg', 'image2.png'];

      await expect(postsService.savePostImages(mockImages)).resolves.toEqual([
        `/${PATH_FROM_PUBLIC_TO_POST_IMAGE}/${mockImages[0]}`,
        `/${PATH_FROM_PUBLIC_TO_POST_IMAGE}/${mockImages[1]}`,
      ]);
    });
  });
});
