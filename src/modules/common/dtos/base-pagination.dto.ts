import { IsNumber, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import {
  PAGINATION_QUERY_CURSOR_DEFAULT,
  PAGINATION_QUERY_TAKE_DEFAULT,
} from '../constants/pagination.constant';
import { generateMessageInvalidNumberType } from '../utils/validator/generate-invalid-message.validator.util';

export class BasePaginationDto {
  @IsOptional()
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  page?: number = PAGINATION_QUERY_CURSOR_DEFAULT;

  @IsOptional()
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  take?: number = PAGINATION_QUERY_TAKE_DEFAULT;
}
