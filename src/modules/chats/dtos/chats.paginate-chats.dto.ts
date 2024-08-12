import { IsIn, IsOptional, IsString, Length } from 'class-validator';
import { BasePaginationDto } from '../../common/dtos/base-pagination.dto';
import { RepositoryQueryOrderEnum } from '../../common/enums/repository.enum';
import {
  generateMessageInvalidLength,
  generateMessageInvalidStringType,
  generateMessageNotIncludedEnumValue,
} from '../../common/utils/validator/generate-invalid-message.validator.util';
import _ from 'lodash';

export class ChatsPaginateChatsDto extends BasePaginationDto {
  @IsOptional()
  @IsString({
    message: generateMessageInvalidStringType,
  })
  @Length(1, 100, {
    message: generateMessageInvalidLength,
  })
  where_name_iLike?: string;

  @IsOptional()
  @IsIn(_.values(RepositoryQueryOrderEnum), {
    message: generateMessageNotIncludedEnumValue,
  })
  order_updatedAt?: RepositoryQueryOrderEnum;
}
