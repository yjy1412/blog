import { RepositoryQueryOrderEnum } from '../enums/repository.enum';
import {
  MoreThan,
  LessThan,
  MoreThanOrEqual,
  LessThanOrEqual,
  Equal,
  Like,
  In,
  Between,
} from 'typeorm';

export const PAGINATION_QUERY_FILTER_MAPPER = {
  moreThan: MoreThan,
  moreThanOrEqual: MoreThanOrEqual,
  lessThan: LessThan,
  lessThanOrEqual: LessThanOrEqual,
  equal: Equal,
  like: Like,
  in: In,
  between: Between,
};

export const PAGINATION_QUERY_CURSOR_DEFAULT = 0;
export const PAGINATION_QUERY_TAKE_DEFAULT = 20;
