import { IsNumber } from 'class-validator';
import { generateMessageInvalidNumberType } from '../../../common/utils/validator/generate-invalid-message.validator.util';

export class ChatsBaseGatewayDto {
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  userId: number;

  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  chatId: number;
}
