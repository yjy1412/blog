import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested } from 'class-validator';

class Name {
  @IsString()
  first: string;

  @IsString()
  last: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @ValidateNested()
  @Type(() => Name)
  name: Name;
}
