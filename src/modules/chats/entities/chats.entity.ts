import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseModel } from '../../common/entities/base.entity';
import { UserModel } from '../../users/entities/users.entity';
import { IsString, Length } from 'class-validator';
import {
  generateMessageInvalidStringType,
  generateMessageInvalidLength,
} from '../../common/utils/validator/generate-invalid-message.validator.util';
import { DB_TABLE_NAME } from '../../common/constants/db-table-name.constant';

@Entity(DB_TABLE_NAME.CHATS)
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

  @ManyToMany(() => UserModel, (user) => user.chats, {
    onDelete: 'NO ACTION',
  })
  @JoinTable({
    name: DB_TABLE_NAME.CHAT_USER_MAPPINGS,
    joinColumn: {
      name: 'chat_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    /**
     * Many-to-many relationship can be set to synchronize automatically
     */
    synchronize: false,
  })
  users?: UserModel[];
}
