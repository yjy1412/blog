import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { QUERY_ORDER_ENUM } from '../constants/enum.constant';
import * as _ from 'lodash';
import {
  QUERY_CURSOR_DEFAULT,
  QUERY_ORDER_DEFAULT,
  QUERY_TAKE_DEFAULT,
} from '../constants/common.constant';

export class BasePaginationDto {
  @IsOptional()
  @IsNumber()
  cursor?: number = QUERY_CURSOR_DEFAULT;

  @IsOptional()
  @IsNumber()
  take?: number = QUERY_TAKE_DEFAULT;

  @IsOptional()
  @IsIn(_.values(QUERY_ORDER_ENUM))
  order_createdAt?: QUERY_ORDER_ENUM = QUERY_ORDER_DEFAULT;
}
