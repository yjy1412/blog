import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { IsEmail, IsString, Matches } from 'class-validator';

import { BaseModel } from '../../common/entities/base.entity';

import { PostModel } from '../../posts/entities/post.entity';
import {
  generateMessageInvalidStringType,
  generateMessageInvalidEmail,
} from '../../common/utils/validator/generate-invalid-message.validator.util';
import { ChatModel } from '../../chats/entities/chat.entity';

@Entity()
export class UserModel extends BaseModel {
  @Column({
    unique: true,
    length: 50,
    comment: '이메일',
  })
  @IsEmail(undefined, {
    message: generateMessageInvalidEmail,
  })
  email: string;

  /**
   * 비밀번호 길이를 설정할 때는 암호화된 비밀번호 길이를 기준으로 설정해야 합니다.
   */
  @Column({
    length: 124,
    comment: '비밀번호',
    select: false,
  })
  @IsString({
    message: generateMessageInvalidStringType,
  })
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{8,15}$/,
    {
      message:
        '비밀번호는 8~15자리의 영문, 숫자, 특수문자(공백제외) 조합이어야 합니다.',
    },
  )
  password: string;

  @Column({
    length: 50,
    comment: '이름',
  })
  @IsString({
    message: generateMessageInvalidStringType,
  })
  name: string;

  @OneToMany(() => PostModel, (post) => post.author)
  posts?: PostModel[];
}
