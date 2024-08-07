import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { RepositoryQueryOrderEnum } from '../../common/enums/repository.enum';
import * as _ from 'lodash';
import { BasePaginationDto } from '../../common/dtos/base-pagination.dto';
import {
  generateMessageInvalidNumberType,
  generateMessageInvalidStringType,
  generateMessageNotIncludedEnumValue,
} from '../../common/utils/validator/generate-invalid-message.validator.util';

export class PaginatePostsDto extends BasePaginationDto {
  @IsOptional()
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  where_likeCount_equal?: number;

  @IsOptional()
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  where_commentCount_equal?: number;

  @IsOptional()
  @IsString({
    message: generateMessageInvalidStringType,
  })
  where_tittle_iLike?: string;

  @IsOptional()
  where_content_iLike?: string;

  @IsOptional()
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  where_likeCount_moreThanOrEqual?: number;

  @IsOptional()
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  where_likeCount_lessThanOrEqual?: number;

  @IsOptional()
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  where_commentCount_moreThanOrEqual?: number;

  @IsOptional()
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  where_commentCount_lessThanOrEqual?: number;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum), {
    message: generateMessageNotIncludedEnumValue,
  })
  order_createdAt?: RepositoryQueryOrderEnum;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum), {
    message: generateMessageNotIncludedEnumValue,
  })
  order_updatedAt?: RepositoryQueryOrderEnum;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum), {
    message: generateMessageNotIncludedEnumValue,
  })
  order_likeCount?: RepositoryQueryOrderEnum;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum), {
    message: generateMessageNotIncludedEnumValue,
  })
  order_commentCount?: RepositoryQueryOrderEnum;
}
