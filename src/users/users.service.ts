import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const users = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(users);
  }

  getUsersAll() {
    return this.usersRepository.find();
  }

  async getUserById(userId: number) {
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

  async updateUserById(userId: number, updateUserDto: UpdateUserDto) {
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

  deleteUserById(userId: number) {
    return this.usersRepository.delete(userId);
  }
}
