import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  htmlMessage: string;

  @IsString()
  textMessage: string;

  @IsEmail()
  to: string;
}
