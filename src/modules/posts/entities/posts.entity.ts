import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNumber, IsString, Length } from 'class-validator';

import { BaseModel } from '../../common/entities/base.entity';

import { UserModel } from '../../users/entities/users.entity';
import {
  generateMessageInvalidStringType,
  generateMessageInvalidLength,
  generateMessageInvalidNumberType,
} from '../../common/utils/validator/generate-invalid-message.validator.util';

@Entity()
export class PostModel extends BaseModel {
  @Column({
    length: 100,
    comment: '제목',
  })
  @IsString({
    message: generateMessageInvalidStringType,
  })
  @Length(1, 100, {
    message: generateMessageInvalidLength,
  })
  title: string;

  @Column({
    length: 1000,
    comment: '내용',
  })
  @IsString({
    message: generateMessageInvalidStringType,
  })
  @Length(1, 1000, {
    message: generateMessageInvalidLength,
  })
  content: string;

  @Column({
    default: 0,
    comment: '좋아요 수',
  })
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  likeCount: number;

  @Column({
    default: 0,
    comment: '댓글 수',
  })
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  commentCount: number;

  /**
   * Users Foreign Key
   */
  @Column({
    comment: '작성자 ID',
  })
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  authorId: number;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '업로드 이미지 경로 리스트',
  })
  images?: string[];

  @ManyToOne(() => UserModel, (user) => user.posts, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author?: UserModel;
}
