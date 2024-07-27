import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsString, ValidateNested } from 'class-validator';

import { BaseModel } from '../../common/entities/base.entity';

import { PostModel } from '../../posts/entities/post.entity';
import { Type } from 'class-transformer';

class Name {
  @Column()
  @IsString()
  first: string;

  @Column()
  @IsString()
  last: string;
}

@Entity()
export class UserModel extends BaseModel {
  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  // Entity Embedding
  @Column(() => Name)
  @ValidateNested()
  @Type(() => Name)
  name: Name;

  @OneToMany(() => PostModel, (post) => post.author)
  posts?: PostModel[];
}
