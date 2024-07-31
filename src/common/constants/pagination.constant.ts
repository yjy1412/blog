import { MoreThanOrEqual, LessThanOrEqual, Equal, ILike } from 'typeorm';

export const PAGINATION_QUERY_FILTER_MAPPER = {
  moreThanOrEqual: MoreThanOrEqual,
  lessThanOrEqual: LessThanOrEqual,
  equal: Equal,
  /**
   * Like와 ILike의 차이는 대소문자 구분 여부에 있습니다.
   * ILike는 대소문자를 구분하지 않습니다.
   */
  iLike: ILike,
};

export const PAGINATION_QUERY_CURSOR_DEFAULT = 1;
export const PAGINATION_QUERY_TAKE_DEFAULT = 20;
