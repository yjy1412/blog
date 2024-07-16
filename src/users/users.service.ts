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

  createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    const users = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(users);
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
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return user;
  }

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

  async deleteUserById(userId: number): Promise<boolean> {
    await this.usersRepository.delete(userId);

    return true;
  }
}
