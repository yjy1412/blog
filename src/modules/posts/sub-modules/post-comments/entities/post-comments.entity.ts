import {
  AfterInsert,
  AfterRemove,
  AfterSoftRemove,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseModel } from '../../../../common/entities/base.entity';
import { PostModel } from '../../../entities/posts.entity';
import { UserModel } from '../../../../users/entities/users.entity';
import { dataSource } from '../../../../../core/db/data-source.db';

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

  @AfterInsert()
  async increasePostCommentsCount() {
    const postsRepository = dataSource.getRepository(PostModel);

    const post = await postsRepository.findOne({ where: { id: this.postId } });

    post.commentCount += 1;

    await postsRepository.save(post);
  }

  @AfterRemove()
  @AfterSoftRemove()
  async decreasePostCommentsCount() {
    const postsRepository = dataSource.getRepository(PostModel);

    const post = await postsRepository.findOne({ where: { id: this.postId } });

    post.commentCount -= 1;

    await postsRepository.save(post);
  }
}
