import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseModel } from '../entities/base.entity';
import { BasePaginationDto } from '../dtos/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import * as _ from 'lodash';
import { PAGINATION_QUERY_FILTER_MAPPER } from '../constants/pagination.constant';
import { PaginationResponse } from '../interfaces/pagination.interface';

@Injectable()
export class PaginationService {
  async paginate<T extends BaseModel>(
    paginateQuery: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ): Promise<PaginationResponse<T>> {
    const findOptions = this.composeFindOptions<T>(
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

  private parseWhereOptions<T>(
    key: string,
    value: string,
  ): FindOptionsWhere<T> {
    const where: FindOptionsWhere<T> = {};

    const split = key.split('_');

    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `where 쿼리 요청에는 2개 또는 3개의 파라미터가 필요합니다. 문제가 있는 쿼리: ${key}`,
      );
    }

    if (split.length === 2) {
      const [_, column] = split;

      where[column] = value;
    }

    if (split.length === 3) {
      const [_, column, operator] = split;

      if (operator === 'between') {
        const values = value.toString().split(',');

        where[column] = PAGINATION_QUERY_FILTER_MAPPER[operator](
          values[0],
          values[1],
        );
      } else {
        where[column] = PAGINATION_QUERY_FILTER_MAPPER[operator](value);
      }
    }

    return where;
  }

  private parseOrderOptions<T>(
    key: string,
    value: string,
  ): FindOptionsOrder<T> {
    const order: FindOptionsOrder<T> = {};
    const split = key.split('_');

    if (split.length !== 2) {
      throw new BadRequestException(
        `order 쿼리 요청에는 2개의 파라미터가 필요합니다. 문제가 있는 쿼리: ${key}`,
      );
    }

    const [_, column] = split;

    order[column] = value;

    return order;
  }

  private composeFindOptions<T>(
    paginateQuery: BasePaginationDto,
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
