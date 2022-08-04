import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(4)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @MinLength(4)
  username: string;
}
