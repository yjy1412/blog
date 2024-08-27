import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserModel } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async createUser(
    newUser: Pick<UserModel, 'email' | 'password' | 'name'>,
  ): Promise<UserModel> {
    const isExistEmail = await this.usersRepository.exists({
      where: {
        email: newUser.email,
      },
    });

    if (isExistEmail) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const user = this.usersRepository.create(newUser);

    return this.usersRepository.save(user);
  }

  getUsersAll(): Promise<UserModel[]> {
    return this.usersRepository.find();
  }

  async getUserById(userId: number): Promise<UserModel> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`유저(id: ${userId})를 찾을 수 없습니다.`);
    }

    return user;
  }

  async updateUserById(
    userId: number,
    updateUser: Partial<UserModel>,
  ): Promise<UserModel> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`유저(id: ${userId})를 찾을 수 없습니다.`);
    }

    return this.usersRepository.save({
      ...user,
      ...updateUser,
    });
  }

  getUserByEmailWithPassword(
    user: Pick<UserModel, 'email'>,
  ): Promise<UserModel> {
    return this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'name'],
      where: {
        email: user.email,
      },
    });
  }
}
