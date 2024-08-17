import { Injectable } from '@nestjs/common';
import { PostCommentsCreateCommentDto } from './dtos/post-comments.create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCommentModel } from './entities/post-comments.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostCommentsService {
  constructor(
    @InjectRepository(PostCommentModel)
    private readonly postCommentsRepository: Repository<PostCommentModel>,
  ) {}

  createComment(authorId: number, newComment: PostCommentsCreateCommentDto) {
    const created = this.postCommentsRepository.create({
      authorId,
      ...newComment,
    });

    return this.postCommentsRepository.save(created);
  }
}
