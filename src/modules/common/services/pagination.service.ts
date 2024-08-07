import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseModel } from '../entities/base.entity';
import { BasePaginationDto } from '../dtos/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import _ from 'lodash';
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
    paginationQuery: Dto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ): Promise<PaginationResponse<T>> {
    const findOptions = this.composeFindOptions<T, Dto>(
      paginationQuery,
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
        currentPage: paginationQuery.page,
        totalPage: Math.ceil(totalCountWithoutPaginate / paginationQuery.take),
      },
    };
  }

  private composeFindOptions<
    T extends BaseModel,
    Dto extends BasePaginationDto,
  >(
    paginationQuery: Dto,
    overrideFindOptions: FindManyOptions<T> = {},
  ): FindManyOptions<T> {
    const findOptions: FindManyOptions<T> = {
      skip: (paginationQuery.page - 1) * paginationQuery.take,
      take: paginationQuery.take,
      where: {},
      order: {},
    };

    Object.entries(paginationQuery).forEach(
      ([paginationQuery, paginationQueryValue]) => {
        if (paginationQuery.startsWith(PaginationQueryPrefixEnum.WHERE)) {
          const where = this.parseWhereOptions<T>(
            paginationQuery,
            paginationQueryValue,
          );

          findOptions.where = { ...findOptions.where, ...where };
        } else if (
          paginationQuery.startsWith(PaginationQueryPrefixEnum.ORDER)
        ) {
          const order = this.parseOrderOptions<T>(
            paginationQuery,
            paginationQueryValue,
          );

          findOptions.order = { ...findOptions.order, ...order };
        }
      },
    );

    return {
      ...findOptions,
      ...overrideFindOptions,
    };
  }

  private parseWhereOptions<T extends BaseModel>(
    paginationWhereQuery: string,
    paginationWhereQueryValue: string,
  ): FindOptionsWhere<T> {
    const where: FindOptionsWhere<T> = {};

    const { column, operator } =
      this.getWhereOptionsFromPaginationQuery(paginationWhereQuery);

    this.validatePaginationWhereQueryOperator(paginationWhereQuery, operator);

    if (operator === PaginationQueryOperatorEnum.ILIKE) {
      where[column] = PAGINATION_QUERY_FILTER_MAPPER[operator](
        `%${paginationWhereQueryValue}%`,
      );
    } else {
      where[column] = PAGINATION_QUERY_FILTER_MAPPER[operator](
        paginationWhereQueryValue,
      );
    }

    return where;
  }

  private parseOrderOptions<T extends BaseModel>(
    paginationOrderQuery: string,
    paginationOrderQueryValue: RepositoryQueryOrderEnum,
  ): FindOptionsOrder<T> {
    const order: FindOptionsOrder<T> = {};

    this.validatePaginationOrderQueryValue(
      paginationOrderQuery,
      paginationOrderQueryValue,
    );

    const column =
      this.getSortingColumnFromPaginationQuery(paginationOrderQuery);

    order[column] = paginationOrderQueryValue;

    return order;
  }

  private getSortingColumnFromPaginationQuery(paginationQuery: string) {
    /**
     * paginationQuery 형식: order_${column}
     */
    const split = paginationQuery.split(PAGINATION_QUERY_SEPERATOR);

    if (split[0] !== PaginationQueryPrefixEnum.ORDER) {
      throw new InternalServerErrorException(
        `order 쿼리 요청에는 "${PaginationQueryPrefixEnum.ORDER}" 접두사를 사용해야 합니다. [ 쿼리: "${paginationQuery}" ]`,
      );
    }

    if (split.length !== 2) {
      throw new InternalServerErrorException(
        `order 쿼리 요청에는 2개의 파라미터가 필요합니다. [ 쿼리: "${paginationQuery}" ]`,
      );
    }

    return split[1];
  }

  private validatePaginationOrderQueryValue(
    paginationOrderQuery: string,
    paginationOrderQueryValue: RepositoryQueryOrderEnum,
  ) {
    const isSortingOrder = _.values(RepositoryQueryOrderEnum).includes(
      paginationOrderQueryValue,
    );

    if (!isSortingOrder) {
      throw new InternalServerErrorException(
        `order 쿼리 요청에는 유효한 정렬 값을 사용해야 합니다. [ 쿼리: "${paginationOrderQuery}: ${paginationOrderQueryValue}" ]`,
      );
    }
  }

  private getWhereOptionsFromPaginationQuery(paginationQuery: string) {
    /**
     * paginationQuery 형식: where_${column}_${operator}
     */
    const split = paginationQuery.split(PAGINATION_QUERY_SEPERATOR);

    if (split[0] !== PaginationQueryPrefixEnum.WHERE) {
      throw new InternalServerErrorException(
        `where 쿼리 요청에는 "${PaginationQueryPrefixEnum.WHERE}" 접두사를 사용해야 합니다. [ 쿼리: "${paginationQuery}" ]`,
      );
    }

    if (split.length !== 3) {
      throw new InternalServerErrorException(
        `where 쿼리 요청에는 "${PAGINATION_QUERY_SEPERATOR}" 구분자를 사용하여 3개의 파라미터가 존재해야 합니다. [ 쿼리: "${paginationQuery}" ]`,
      );
    }

    return {
      column: split[1],
      operator: split[2],
    };
  }

  private validatePaginationWhereQueryOperator(
    paginationQuery: string,
    operator: string,
  ) {
    const isOperatorAllowed = _.keys(PAGINATION_QUERY_FILTER_MAPPER).includes(
      operator,
    );

    if (!isOperatorAllowed) {
      throw new InternalServerErrorException(
        `where 쿼리 요청에 허용되지 않는 연산자가 포함되어 있습니다. [ 쿼리: "${paginationQuery}" ]`,
      );
    }
  }
}
