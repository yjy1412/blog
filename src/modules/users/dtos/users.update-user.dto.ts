import { PartialType, PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entities/users.entity';

export class UsersUpdateUserDto extends PartialType(
  PickType(UserModel, ['name']),
) {}
