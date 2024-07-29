import * as dotenv from 'dotenv';
dotenv.config();

import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseModel } from './entities/base.entity';
import { BasePaginationDto } from './dtos/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import * as _ from 'lodash';
import { FILTER_MAPPER } from './constants/filter-mapper.constant';
import { Pagination } from './interfaces/pagination.interface';

const { PROTOCOL, HOST, PORT } = process.env;

@Injectable()
export class CommonService {
  async cursorPaginate<T extends BaseModel>(
    path: string,
    queryParams: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ): Promise<Pagination<T>> {
    const findOptions = this.composeFindOptions<T>(
      queryParams,
      overrideFindOptions,
    );

    const data = await repository.find(findOptions);

    const isNextExist = data.length === queryParams.take;

    return {
      data,
      page: {
        cursor: {
          after: isNextExist ? queryParams.cursor + queryParams.take + 1 : null,
        },
        count: data.length,
        nextUrl: isNextExist
          ? this.generatePaginationNextUrl(queryParams, path)
          : null,
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

        where[column] = FILTER_MAPPER[operator](values[0], values[1]);
      } else {
        where[column] = FILTER_MAPPER[operator](value);
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
    queryParams: BasePaginationDto,
    overrideFindOptions: FindManyOptions<T> = {},
  ): FindManyOptions<T> {
    const findOptions: FindManyOptions<T> = {
      skip: queryParams.cursor,
      take: queryParams.take,
      order: {},
      where: {},
    };

    Object.entries(queryParams).forEach(([key, value]) => {
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

  private generatePaginationNextUrl(
    queryParams: BasePaginationDto,
    path: string,
  ): string {
    const nextUrl = new URL(`${PROTOCOL}://${HOST}:${PORT}/${path}`);

    Object.entries(queryParams).forEach(([key, value]) => {
      if (key === 'cursor') {
        nextUrl.searchParams.append(key, value + queryParams.take + 1);
      } else {
        nextUrl.searchParams.append(key, value);
      }
    });

    return nextUrl.toString();
  }
}
