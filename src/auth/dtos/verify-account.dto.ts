import { IsEmail, IsNumber } from 'class-validator';

export class VerifyAccountDto {
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;
}
