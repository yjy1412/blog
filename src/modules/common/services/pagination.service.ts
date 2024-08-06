import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseModel } from '../entities/base.entity';
import { BasePaginationDto } from '../dtos/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { keys, values } from 'lodash';
import {
  PAGINATION_QUERY_FILTER_MAPPER,
  PAGINATION_QUERY_SEPERATOR,
} from '../constants/pagination.constant';
import { PaginationResponse } from '../interfaces/pagination.interface';
import { RepositoryQueryOrderEnum } from '../enums/repository.enum';
import {
  PaginationQueryOperatorEnum,
  PaginationQueryPrefixEnum,
} from '../enums/pagination.enum';

@Injectable()
export class PaginationService {
  async paginate<T extends BaseModel, Dto extends BasePaginationDto>(
    paginateQuery: Dto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ): Promise<PaginationResponse<T>> {
    const findOptions = this.composeFindOptions<T, Dto>(
      paginateQuery,
      overrideFindOptions,
    );

    /**
     * findAndCount는 skip과 take를 적용하지 않은 상태에서의 전체 데이터 개수를 반환합니다.
     */
    const [data, totalCountWithoutPaginate] =
      await repository.findAndCount(findOptions);

    return {
      data,
      page: {
        currentPage: paginateQuery.page,
        totalPage: Math.ceil(totalCountWithoutPaginate / paginateQuery.take),
      },
    };
  }

  private parseWhereOptions<T extends BaseModel>(
    key: string,
    value: string,
  ): FindOptionsWhere<T> {
    const where: FindOptionsWhere<T> = {};

    const split = key.split(PAGINATION_QUERY_SEPERATOR);

    if (split.length !== 3) {
      throw new InternalServerErrorException(
        `where 쿼리 요청에는 "${PAGINATION_QUERY_SEPERATOR}" 구분자를 사용하여 3개의 파라미터가 존재해야 합니다. [ 쿼리: "${key}: ${value}" ]`,
      );
    }

    const [_, column, operator] = split;

    const isOperatorAllowed = keys(PAGINATION_QUERY_FILTER_MAPPER).includes(
      operator,
    );

    if (!isOperatorAllowed) {
      throw new InternalServerErrorException(
        `where 쿼리 요청에는 유효한 연산자를 사용해야 합니다. [ 쿼리: "${key}: ${value}" ]`,
      );
    }

    if (operator === PaginationQueryOperatorEnum.ILIKE) {
      where[column] = PAGINATION_QUERY_FILTER_MAPPER[operator](`%${value}%`);
    } else {
      where[column] = PAGINATION_QUERY_FILTER_MAPPER[operator](value);
    }

    return where;
  }

  private parseOrderOptions<T extends BaseModel>(
    key: string,
    value: RepositoryQueryOrderEnum,
  ): FindOptionsOrder<T> {
    const order: FindOptionsOrder<T> = {};

    const split = key.split(PAGINATION_QUERY_SEPERATOR);

    if (split.length !== 2) {
      throw new InternalServerErrorException(
        `order 쿼리 요청에는 2개의 파라미터가 필요합니다. [ 쿼리: "${key}: ${value}" ]`,
      );
    }

    const isValueAllowed = values(RepositoryQueryOrderEnum).includes(value);
    if (!isValueAllowed) {
      throw new InternalServerErrorException(
        `order 쿼리 요청에는 유효한 정렬 값을 사용해야 합니다. [ 쿼리: "${key} : ${value}" ]`,
      );
    }

    const [_, column] = split;

    order[column] = value;

    return order;
  }

  private composeFindOptions<
    T extends BaseModel,
    Dto extends BasePaginationDto,
  >(
    paginateQuery: Dto,
    overrideFindOptions: FindManyOptions<T> = {},
  ): FindManyOptions<T> {
    const findOptions: FindManyOptions<T> = {
      skip: (paginateQuery.page - 1) * paginateQuery.take,
      take: paginateQuery.take,
      where: {},
      order: {},
    };

    Object.entries(paginateQuery).forEach(([key, value]) => {
      if (key.startsWith(PaginationQueryPrefixEnum.WHERE)) {
        const where = this.parseWhereOptions<T>(key, value);

        findOptions.where = { ...findOptions.where, ...where };
      } else if (key.startsWith(PaginationQueryPrefixEnum.ORDER)) {
        const order = this.parseOrderOptions<T>(key, value);

        findOptions.order = { ...findOptions.order, ...order };
      }
    });

    return {
      ...findOptions,
      ...overrideFindOptions,
    };
  }
}
