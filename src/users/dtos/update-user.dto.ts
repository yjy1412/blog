import { PartialType, PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(PickType(UserModel, ['name'])) {}
