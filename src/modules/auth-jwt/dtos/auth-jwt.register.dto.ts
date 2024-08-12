import { PickType } from '@nestjs/mapped-types';

import { UserModel } from '../../users/entities/users.entity';

export class AuthJwtRegisterDto extends PickType(UserModel, [
  'email',
  'password',
  'name',
]) {}
