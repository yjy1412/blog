import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../../common/entities/base.entity';
import { PostModel } from '../../../entities/posts.entity';
import { UserModel } from '../../../../users/entities/users.entity';

@Entity()
export class PostCommentModel extends BaseModel {
  @Column({
    comment: '게시글 ID',
  })
  postId: number;

  @Column({
    comment: '작성자 ID',
  })
  authorId: number;

  @Column({
    length: 500,
    comment: '댓글 내용',
  })
  comment: string;

  @ManyToOne(() => PostModel, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post?: PostModel;

  @ManyToOne(() => UserModel, (user) => user.comments)
  @JoinColumn({ name: 'authorId' })
  author?: UserModel;
}
