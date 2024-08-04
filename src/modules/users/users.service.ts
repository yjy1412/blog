import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserModel } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  /**
   * 유저 생성
   */
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

  /**
   * 모든 유저 조회
   */
  getUsersAll(): Promise<UserModel[]> {
    return this.usersRepository.find();
  }

  /**
   * 유저 조회
   */
  async getUserById(userId: number): Promise<UserModel> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }

  /**
   * 유저 정보 수정
   */
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
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return this.usersRepository.save({
      ...user,
      ...updateUser,
    });
  }

  /**
   * 유저 삭제
   */
  async deleteUserById(userId: number): Promise<boolean> {
    await this.usersRepository.delete(userId);

    return true;
  }

  /**
   * 이메일에 해당하는 비밀번호를 포함한 유저정보 조회
   */
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
