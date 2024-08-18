import { DataSource } from 'typeorm';
import { PostModel } from '../../../modules/posts/entities/posts.entity';
import { UserModel } from '../../../modules/users/entities/users.entity';
import { generateRandomNumber } from '../../../modules/common/utils/generate-random-number.util';

export const postsSeed = async (dataSource: DataSource) => {
  const postsRepository = dataSource.getRepository(PostModel);
  const usersRepository = dataSource.getRepository(UserModel);

  const count = await postsRepository.count();
  if (count > 0) return;

  const posts = [];

  const users = await usersRepository.find();

  for (let i = 0; i < 100; i += 1) {
    posts.push(
      postsRepository.create({
        title: `[테스트] 포스트 제목 ${i}`,
        content: `테스트 ${i}`,
        likeCount: generateRandomNumber(0, 100),
        commentCount: generateRandomNumber(0, 100),
        author: users[i],
      }),
    );
  }

  await postsRepository.save(posts);
};
