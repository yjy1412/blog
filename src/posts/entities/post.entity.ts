import { BaseModel } from 'src/common/entities/base.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

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
}
