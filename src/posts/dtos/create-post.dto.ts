import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  likeCount: number;

  @IsNumber()
  commentCount: number;
}
