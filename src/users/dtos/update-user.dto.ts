import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UserModel } from '../entities/user.entity';

class Name {
  @IsString()
  first: string;

  @IsString()
  last: string;
}

export class UpdateUserDto extends PartialType(UserModel) {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Name)
  name: Name;
}
