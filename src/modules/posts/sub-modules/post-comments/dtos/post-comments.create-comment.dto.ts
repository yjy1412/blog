import { IsNumber, IsString, Length } from 'class-validator';
import {
  generateMessageInvalidLength,
  generateMessageInvalidNumberType,
  generateMessageInvalidStringType,
} from '../../../../common/utils/validator/generate-invalid-message.validator.util';

export class PostCommentsCreateCommentDto {
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  postId: number;

  @IsString({
    message: generateMessageInvalidStringType,
  })
  @Length(1, 500, {
    message: generateMessageInvalidLength,
  })
  comment: string;
}
