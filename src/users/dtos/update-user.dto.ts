import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

class Name {
  @IsString()
  first: string;

  @IsString()
  last: string;
}

export class UpdateUserDto {
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
