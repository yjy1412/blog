import { PickType } from '@nestjs/mapped-types';

import { PostModel } from '../entities/posts.entity';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class PostsCreatePostDto extends PickType(PostModel, [
  'title',
  'content',
  'likeCount',
  'commentCount',
]) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
