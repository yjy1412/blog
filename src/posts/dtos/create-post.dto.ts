import { PickType } from '@nestjs/mapped-types';

import { PostModel } from '../entities/post.entity';
import { IsOptional } from 'class-validator';

export class CreatePostDto extends PickType(PostModel, [
  'title',
  'content',
  'likeCount',
  'commentCount',
]) {
  @IsOptional()
  images?: string[];
}
