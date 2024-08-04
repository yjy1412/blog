import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { RepositoryQueryOrderEnum } from '../../common/enums/repository.enum';
import * as _ from 'lodash';
import { BasePaginationDto } from '../../common/dtos/base-pagination.dto';

export class PaginatePostsDto extends BasePaginationDto {
  @IsOptional()
  @IsNumber()
  where_likeCount_equal?: number;

  @IsOptional()
  @IsNumber()
  where_commentCount_equal?: number;

  @IsOptional()
  @IsString()
  where_tittle_iLike?: string;

  @IsOptional()
  where_content_iLike?: string;

  @IsOptional()
  @IsNumber()
  where_likeCount_moreThanOrEqual?: number;

  @IsOptional()
  @IsNumber()
  where_likeCount_lessThanOrEqual?: number;

  @IsOptional()
  @IsNumber()
  where_commentCount_moreThanOrEqual?: number;

  @IsOptional()
  @IsNumber()
  where_commentCount_lessThanOrEqual?: number;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum))
  order_createdAt?: RepositoryQueryOrderEnum;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum))
  order_updatedAt?: RepositoryQueryOrderEnum;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum))
  order_likeCount?: RepositoryQueryOrderEnum;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum))
  order_commentCount?: RepositoryQueryOrderEnum;
}
