import { PostModel } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from 'src/common/entities/base.entity';

class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}

@Entity()
export class UserModel extends BaseModel {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  // Entity Embedding
  @Column(() => Name)
  name: Name;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
