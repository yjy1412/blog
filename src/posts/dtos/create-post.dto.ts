import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';
import { PostModel } from '../entities/post.entity';

export class CreatePostDto extends PartialType(PostModel) {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  likeCount: number;

  @IsNumber()
  commentCount: number;
}
