import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsString, Matches, ValidateNested } from 'class-validator';

import { BaseModel } from '../../common/entities/base.entity';

import { PostModel } from '../../posts/entities/post.entity';
import { Type } from 'class-transformer';
import { generateMessageInvalidStringType } from '../../common/validator-messages/generate-message-invalid-string-type.message';
import { generateMessageInvalidEmail } from '../../common/validator-messages/generate-validation-invalid-email.message';

class Name {
  /**
   * nameFirst
   */
  @Column({
    length: 50,
    comment: '성',
  })
  @IsString({
    message: generateMessageInvalidStringType,
  })
  first: string;

  /**
   * nameLast
   */
  @Column({
    length: 50,
    comment: '이름',
  })
  @IsString({
    message: generateMessageInvalidStringType,
  })
  last: string;
}

@Entity()
export class UserModel extends BaseModel {
  /**
   * email
   */
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
   * password
   *
   * 비밀번호 길이를 설정할 때는 암호화된 비밀번호 길이를 기준으로 설정해야 합니다.
   */
  @Column({
    length: 124,
    comment: '비밀번호',
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

  /**
   * name
   */
  @Column(() => Name)
  @ValidateNested()
  @Type(() => Name)
  name: Name;

  /**
   * posts
   *
   * OneToMany Relation with PostModel
   */
  @OneToMany(() => PostModel, (post) => post.author)
  posts?: PostModel[];
}
