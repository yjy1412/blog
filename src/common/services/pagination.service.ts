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
import { PAGINATION_QUERY_FILTER_MAPPER } from '../constants/pagination.constant';
import { PaginationResponse } from '../interfaces/pagination.interface';
import { RepositoryQueryOrderEnum } from '../enums/repository.enum';

@Injectable()
export class PaginationService {
  /**
   * 전달받은 Repository를 이용하여 DB 조회를 수행하고, 페이지네이션 결과를 반환합니다.
   *
   * overrideFindOptions를 통해 기본적인 FindManyOptions를 덮어쓸 수 있습니다.
   * findAndCount 메서드를 이용하여 전체 데이터 개수를 조회합니다.
   * 결과에는 페이지 메타정보가 포함됩니다.
   */
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

  /**
   * 요청 쿼리를 파싱하여 DB 조회에 필요한 조건절에 해당하는 정보를 반환합니다.
   *
   * key는 요청쿼리에 해당합니다.
   * key는 ${where_컬럼명_연산자} 형태로 구성됩니다.
   * 연산자가 따로 포함되지 않는 경우에는 ${where_컬럼명} 형태로 구성됩니다.
   *
   * value는 요청쿼리 값에 해당합니다.
   */
  private parseWhereOptions<T extends BaseModel>(
    key: string,
    value: string,
  ): FindOptionsWhere<T> {
    const where: FindOptionsWhere<T> = {};

    const split = key.split('_');

    if (split.length !== 3) {
      throw new InternalServerErrorException(
        `where 쿼리 요청에는 "_" 구분자를 사용하여 3개의 파라미터가 존재해야 합니다. [ 쿼리: "${key}: ${value}" ]`,
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

    if (operator === 'iLike') {
      where[column] = PAGINATION_QUERY_FILTER_MAPPER[operator](`%${value}%`);
    } else {
      where[column] = PAGINATION_QUERY_FILTER_MAPPER[operator](value);
    }

    return where;
  }

  /**
   * 요청 쿼리를 파싱하여 DB 조회에 필요한 정렬 조건에 해당하는 정보를 반환합니다.
   *
   * key는 요청쿼리에 해당합니다.
   * key는 ${order_컬럼명} 형태로 구성됩니다.
   *
   * value는 요청쿼리 값에 해당합니다.
   */
  private parseOrderOptions<T extends BaseModel>(
    key: string,
    value: RepositoryQueryOrderEnum,
  ): FindOptionsOrder<T> {
    const order: FindOptionsOrder<T> = {};
    const split = key.split('_');

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

  /**
   * 요청 쿼리를 파싱하여 DB 조회쿼리에 필요한 정보를 반환합니다.
   */
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
      if (key.startsWith('where')) {
        const where = this.parseWhereOptions<T>(key, value);

        findOptions.where = { ...findOptions.where, ...where };
      } else if (key.startsWith('order')) {
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
