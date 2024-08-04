import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNumber, IsString, Length } from 'class-validator';

import { BaseModel } from '../../common/entities/base.entity';

import { UserModel } from '../../users/entities/user.entity';
import { generateMessageInvalidStringType } from '../../common/validator-messages/generate-message-invalid-string-type.message';
import { generateMessageInvalidLength } from '../../common/validator-messages/generate-message-invalid-length.message';
import { generateMessageInvalidNumberType } from '../../common/validator-messages/generate-message-invalid-number-type.message';

@Entity()
export class PostModel extends BaseModel {
  /**
   * title
   */
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

  /**
   * content
   */
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

  /**
   * likeCount
   */
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
  @IsNumber()
  commentCount: number;

  /**
   * authorId
   *
   * Users Foreign Key
   */
  @Column({
    comment: '작성자 ID',
  })
  @IsNumber(undefined, {
    message: generateMessageInvalidNumberType,
  })
  authorId: number;

  /**
   * image
   */
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '업로드 이미지 경로 리스트',
  })
  images?: string[];

  /**
   * author
   *
   * ManyToOne Relation with UserModel
   */
  @ManyToOne(() => UserModel, (user) => user.posts, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author?: UserModel;
}
