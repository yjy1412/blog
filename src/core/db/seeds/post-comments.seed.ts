import { DataSource } from 'typeorm';
import { PostCommentModel } from '../../../modules/posts/sub-modules/post-comments/entities/post-comments.entity';
import { PostModel } from '../../../modules/posts/entities/posts.entity';
import { UserModel } from '../../../modules/users/entities/users.entity';
import { generateRandomNumber } from '../../../modules/common/utils/generate-random-number.util';

export const postCommentsSeed = async (dataSource: DataSource) => {
  const postCommentsRepository = dataSource.getRepository(PostCommentModel);
  const postsRepository = dataSource.getRepository(PostModel);
  const usersRepository = dataSource.getRepository(UserModel);

  const count = await postCommentsRepository.count();

  if (count > 0) return;

  const posts = await postsRepository.find();
  const users = await usersRepository.find();

  const commentExamples = [
    '좋은 글이네요!',
    '공유 감사합니다!',
    '잘 보고 갑니다!',
  ];

  for (const post of posts) {
    if (post.commentCount === 0) continue;

    const postComments = [];

    for (let i = 0; i < post.commentCount; i += 1) {
      postComments.push(
        postCommentsRepository.create({
          postId: post.id,
          authorId: users[generateRandomNumber(0, users.length - 1)].id,
          comment:
            commentExamples[
              generateRandomNumber(0, commentExamples.length - 1)
            ],
          post,
        }),
      );
    }

    await postCommentsRepository.save(postComments);
  }
};
