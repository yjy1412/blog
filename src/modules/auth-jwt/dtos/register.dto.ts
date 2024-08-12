import { PickType } from '@nestjs/mapped-types';

import { UserModel } from '../../users/entities/users.entity';

export class RegisterDto extends PickType(UserModel, [
  'email',
  'password',
  'name',
]) {}
