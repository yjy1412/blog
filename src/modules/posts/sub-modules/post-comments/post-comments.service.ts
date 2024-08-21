import { BadRequestException, Injectable } from '@nestjs/common';
import { PostCommentsCreateCommentDto } from './dtos/post-comments.create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCommentModel } from './entities/post-comments.entity';
import { Repository } from 'typeorm';
import { PostModel } from '../../entities/posts.entity';

@Injectable()
export class PostCommentsService {
  constructor(
    @InjectRepository(PostCommentModel)
    private readonly postCommentsRepository: Repository<PostCommentModel>,
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
  ) {}

  async checkPostExist(postId: number): Promise<void> {
    const post = await this.postsRepository.exists({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new BadRequestException(
        '댓글이 생성될 게시물 정보를 찾을 수 업습니다.',
      );
    }
  }

  async createPostComment(
    authorId: number,
    newComment: PostCommentsCreateCommentDto,
  ): Promise<PostCommentModel> {
    await this.checkPostExist(newComment.postId);

    const created = this.postCommentsRepository.create({
      authorId,
      ...newComment,
    });

    const newPostComment = await this.postCommentsRepository.save(created);

    return newPostComment;
  }

  async deleteMyPostComment(
    userId: number,
    commentId: number,
  ): Promise<null | PostCommentModel> {
    const comment = await this.postCommentsRepository.findOne({
      where: {
        id: commentId,
        authorId: userId,
      },
    });

    if (!comment) {
      return null;
    }

    await this.postCommentsRepository.softRemove(comment);

    return comment;
  }
}
