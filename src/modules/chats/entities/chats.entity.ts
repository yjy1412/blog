import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseModel } from '../../common/entities/base.entity';
import { UserModel } from '../../users/entities/user.entity';
import { IsString, Length } from 'class-validator';
import {
  generateMessageInvalidStringType,
  generateMessageInvalidLength,
} from '../../common/utils/validator/generate-invalid-message.validator.util';

@Entity()
export class ChatModel extends BaseModel {
  @Column({
    length: 50,
    comment: '채팅방 이름',
  })
  @IsString({
    message: generateMessageInvalidStringType,
  })
  @Length(1, 50, {
    message: generateMessageInvalidLength,
  })
  name: string;

  @Column({
    length: 100,
    comment: '채팅방 설명',
  })
  @IsString({
    message: generateMessageInvalidStringType,
  })
  @Length(1, 100, {
    message: generateMessageInvalidLength,
  })
  description: string;

  @ManyToMany(() => UserModel, (user) => user.chats)
  @JoinTable()
  users?: UserModel[];
}
