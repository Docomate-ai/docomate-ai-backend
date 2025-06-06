import { IsEmail, IsString } from 'class-validator';

export class RegisterAccountDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
