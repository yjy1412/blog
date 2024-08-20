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

  async createPostComment(
    authorId: number,
    newComment: PostCommentsCreateCommentDto,
  ): Promise<PostCommentModel> {
    const created = this.postCommentsRepository.create({
      authorId,
      ...newComment,
    });

    return this.postCommentsRepository.save(created);
  }

  async deleteMyPostComment(
    userId: number,
    commentId: number,
  ): Promise<boolean> {
    const comment = await this.postCommentsRepository.findOne({
      where: {
        id: commentId,
        authorId: userId,
      },
    });

    if (!comment) {
      return true;
    }

    await this.postCommentsRepository.softRemove(comment);

    return true;
  }
}
