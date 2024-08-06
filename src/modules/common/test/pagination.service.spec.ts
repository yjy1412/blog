import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from '../services/pagination.service';
import { PostModel } from '../../posts/entities/post.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BasePaginationDto } from '../dtos/base-pagination.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('\n🎯🎯🎯 테스트를 시작합니다 ===================================================================================================================================\n', () => {
  let paginationService: PaginationService;
  let postsRepository: Repository<PostModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaginationService,
        {
          provide: getRepositoryToken(PostModel),
          useClass: Repository,
        },
      ],
    }).compile();

    paginationService = module.get<PaginationService>(PaginationService);
    postsRepository = module.get<Repository<PostModel>>(
      getRepositoryToken(PostModel),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ PaginationService >> paginate: 전달받은 Repository를 이용하여 DB 조회를 수행하고, 페이지네이션 결과를 반환합니다.', () => {
    test('조건절에 해당하는 쿼리는 구분자 "_"를 사용하여 3개의 파라미터로 구성되어야 합니다.', async () => {
      class mockWrongDto extends BasePaginationDto {
        where_likeCount_commentCount_moreThan: 10;
      }

      const mockWrongPaginationQuery: mockWrongDto = {
        where_likeCount_commentCount_moreThan: 10,
      };

      expect(
        paginationService.paginate<PostModel, mockWrongDto>(
          mockWrongPaginationQuery,
          postsRepository,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });

    test('조건절에 해당하는 쿼리에는 허용된 오퍼레이터만 사용할 수 있습니다.', async () => {
      class mockWrongDto extends BasePaginationDto {
        where_likeCount_wrongOperator: 10;
      }

      const mockWrongPaginationQuery: mockWrongDto = {
        where_likeCount_wrongOperator: 10,
      };

      expect(
        paginationService.paginate<PostModel, mockWrongDto>(
          mockWrongPaginationQuery,
          postsRepository,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });

    test('정렬에 해당하는 쿼리는 구분자 "_"를 사용하여 2개 파라미터로 구성되어야 합니다.', async () => {
      class mockWrongDto extends BasePaginationDto {
        order_likeCount_desc: 'DESC';
      }

      const mockWrongPaginationQuery: mockWrongDto = {
        order_likeCount_desc: 'DESC',
      };

      expect(
        paginationService.paginate<PostModel, mockWrongDto>(
          mockWrongPaginationQuery,
          postsRepository,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });

    test('정렬에 해당하는 order_로 시작하는 정렬 페이지네이션 쿼리값은 ASC 또는 DESC 중 하나여야 합니다.', async () => {
      class mockWrongDto extends BasePaginationDto {
        order_likeCount: 'WRONG';
      }

      const mockWrongPaginationQuery: mockWrongDto = {
        order_likeCount: 'WRONG',
      };

      expect(
        paginationService.paginate<PostModel, mockWrongDto>(
          mockWrongPaginationQuery,
          postsRepository,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
