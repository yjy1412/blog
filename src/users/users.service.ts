import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
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
  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    const isExistEmail = await this.usersRepository.exists({
      where: {
        email: createUserDto.email,
      },
    });

    if (isExistEmail) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const users = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(users);
  }

  /**
   * 모든 유저 조회
   */
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
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }

  /**
   * 유저 정보 수정
   */
  async updateUserById(
    userId: number,
    updateUserDto: UpdateUserDto,
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
      ...updateUserDto,
    });
  }

  /**
   * 유저 삭제
   */
  async deleteUserById(userId: number): Promise<boolean> {
    await this.usersRepository.delete(userId);

    return true;
  }

  getUserByEmail(user: Pick<UserModel, 'email'>): Promise<UserModel> {
    return this.usersRepository.findOne({
      where: {
        email: user.email,
      },
    });
  }
}
