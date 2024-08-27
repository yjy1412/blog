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
import { DB_TABLE_NAME } from '../../../../common/constants/db-table-name.constant';

@Entity(DB_TABLE_NAME.POST_COMMENTS)
export class PostCommentModel extends BaseModel {
  @Column({
    name: 'post_id',
    comment: '게시글 ID',
  })
  postId: number;

  @Column({
    name: 'author_id',
    comment: '작성자 ID',
  })
  authorId: number;

  @Column({
    length: 500,
    comment: '댓글 내용',
  })
  comment: string;

  @ManyToOne(() => PostModel, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post?: PostModel;

  @ManyToOne(() => UserModel, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
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
