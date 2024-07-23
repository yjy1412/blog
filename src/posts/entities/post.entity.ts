import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseModel } from '../../common/entities/base.entity';

import { UserModel } from '../../users/entities/user.entity';

@Entity()
export class PostModel extends BaseModel {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  @ManyToOne(() => UserModel, (user) => user.posts, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  author: UserModel;

  authorId: number;
}
