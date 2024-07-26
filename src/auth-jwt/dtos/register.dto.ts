import { PickType } from '@nestjs/mapped-types';

import { UserModel } from '../../users/entities/user.entity';

export class RegisterDto extends PickType(UserModel, [
  'email',
  'password',
  'name',
]) {}
