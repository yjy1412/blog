import { PickType } from '@nestjs/mapped-types';

import { PostModel } from '../entities/posts.entity';
import { IsOptional } from 'class-validator';

export class PostsCreatePostDto extends PickType(PostModel, [
  'title',
  'content',
  'likeCount',
  'commentCount',
]) {
  @IsOptional()
  images?: string[];
}
