import { BaseModel } from 'src/common/entities/base-model.entity';
import { Column, Entity } from 'typeorm';

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
}
