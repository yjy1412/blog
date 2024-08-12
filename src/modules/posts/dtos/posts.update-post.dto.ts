import { PartialType, PickType } from '@nestjs/mapped-types';

import { PostModel } from '../entities/posts.entity';

export class PostsUpdatePostDto extends PartialType(
  PickType(PostModel, ['title', 'content', 'likeCount', 'commentCount']),
) {}
