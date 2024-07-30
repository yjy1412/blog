import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { RepositoryQueryOrderEnum } from '../enums/repository.enum';
import * as _ from 'lodash';
import {
  PAGINATION_QUERY_CURSOR_DEFAULT,
  PAGINATION_QUERY_ORDER_DEFAULT,
  PAGINATION_QUERY_TAKE_DEFAULT,
} from '../constants/pagination.constant';

export class BasePaginationDto {
  @IsOptional()
  @IsNumber()
  cursor?: number = PAGINATION_QUERY_CURSOR_DEFAULT;

  @IsOptional()
  @IsNumber()
  take?: number = PAGINATION_QUERY_TAKE_DEFAULT;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum))
  order_createdAt?: RepositoryQueryOrderEnum = PAGINATION_QUERY_ORDER_DEFAULT;
}
