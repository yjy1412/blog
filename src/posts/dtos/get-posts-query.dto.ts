import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { QUERY_ORDER_ENUM } from '../../common/constants/enum.constant';
import * as _ from 'lodash';
import { BasePaginationDto } from '../../common/dtos/base-pagination.dto';

export class GetPostsQueryDto extends BasePaginationDto {
  @IsOptional()
  @IsNumber()
  where_likeCount_moreThan?: number;

  @IsOptional()
  @IsIn(_.values(QUERY_ORDER_ENUM))
  order_likeCount?: QUERY_ORDER_ENUM;

  @IsOptional()
  @IsIn(_.values(QUERY_ORDER_ENUM))
  order_commentCount?: QUERY_ORDER_ENUM;
}
