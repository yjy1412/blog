import { MoreThanOrEqual, LessThanOrEqual, Equal, ILike } from 'typeorm';
import { PaginationQueryOperatorEnum } from '../enums/pagination.enum';

export const PAGINATION_QUERY_FILTER_MAPPER = {
  [PaginationQueryOperatorEnum.EQUAL]: Equal,
  [PaginationQueryOperatorEnum.MORE_THAN_OR_EQUAL]: MoreThanOrEqual,
  [PaginationQueryOperatorEnum.LESS_THAN_OR_EQUAL]: LessThanOrEqual,
  /**
   * Like와 ILike의 차이는 대소문자 구분 여부에 있습니다.
   * ILike는 대소문자를 구분하지 않습니다.
   */
  [PaginationQueryOperatorEnum.ILIKE]: ILike,
};

export const PAGINATION_QUERY_CURSOR_DEFAULT: number = 1;
export const PAGINATION_QUERY_TAKE_DEFAULT: number = 20;
export const PAGINATION_QUERY_SEPERATOR: string = '_';
