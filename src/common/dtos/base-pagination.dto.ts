import { IsNumber, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import {
  PAGINATION_QUERY_CURSOR_DEFAULT,
  PAGINATION_QUERY_TAKE_DEFAULT,
} from '../constants/pagination.constant';

export class BasePaginationDto {
  @IsOptional()
  @IsNumber()
  cursor?: number = PAGINATION_QUERY_CURSOR_DEFAULT;

  @IsOptional()
  @IsNumber()
  take?: number = PAGINATION_QUERY_TAKE_DEFAULT;
}
