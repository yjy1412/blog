import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

import { BaseModel } from '../../common/entities/base.entity';

import { UserModel } from '../../users/entities/user.entity';

@Entity()
export class PostModel extends BaseModel {
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;

  @Column()
  @IsNumber()
  likeCount: number;

  @Column()
  @IsNumber()
  commentCount: number;

  @Column()
  @IsNumber()
  authorId: number;

  @ManyToOne(() => UserModel, (user) => user.posts, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: UserModel;
}
