import { IsString } from 'class-validator';
import { ChatsBaseGatewayDto } from './chats.base.gateway.dto';
import { generateMessageInvalidStringType } from '../../../common/utils/validator/generate-invalid-message.validator.util';

export class ChatsSendMessageGatewayDto extends ChatsBaseGatewayDto {
  @IsString({
    message: generateMessageInvalidStringType,
  })
  message: string;
}
