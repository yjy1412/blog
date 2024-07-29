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

export const FILTER_MAPPER = {
  moreThan: MoreThan,
  moreThanOrEqual: MoreThanOrEqual,
  lessThan: LessThan,
  lessThanOrEqual: LessThanOrEqual,
  equal: Equal,
  like: Like,
  in: In,
  between: Between,
};
