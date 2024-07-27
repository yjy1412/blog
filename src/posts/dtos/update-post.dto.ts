import { PartialType, PickType } from '@nestjs/mapped-types';

import { PostModel } from '../entities/post.entity';

export class UpdatePostDto extends PartialType(
  PickType(PostModel, ['title', 'content', 'likeCount', 'commentCount']),
) {}
