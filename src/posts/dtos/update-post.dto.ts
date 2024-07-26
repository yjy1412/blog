import { PartialType } from '@nestjs/mapped-types';

import { PostModel } from '../entities/post.entity';

export class UpdatePostDto extends PartialType(PostModel) {}
