import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { RepositoryQueryOrderEnum } from '../../common/enums/repository.enum';
import * as _ from 'lodash';
import { BasePaginationDto } from '../../common/dtos/base-pagination.dto';

export class GetPostsQueryDto extends BasePaginationDto {
  @IsOptional()
  @IsNumber()
  where_likeCount_moreThan?: number;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum))
  order_likeCount?: RepositoryQueryOrderEnum;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum))
  order_commentCount?: RepositoryQueryOrderEnum;
}
