import { Column, Entity, OneToMany } from 'typeorm';

import { BaseModel } from '../../common/entities/base.entity';

import { PostModel } from '../../posts/entities/post.entity';

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
