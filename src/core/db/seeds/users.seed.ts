import { DataSource } from 'typeorm';
import { UserModel } from '../../../modules/users/entities/users.entity';

export const usersSeed = async (dataSource: DataSource) => {
  const usersRepository = dataSource.getRepository(UserModel);

  const count = await usersRepository.count();
  if (count > 0) return;

  const users = [];

  for (let i = 0; i < 100; i += 1) {
    users.push({
      email: `tester${i}@blog.com`,
      password: 'testPassword12!',
      name: `테스터${i}`,
    });
  }

  const created = usersRepository.create(users);

  await usersRepository.save(created);
};
