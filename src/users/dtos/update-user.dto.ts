import { IsArray, IsEmail, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsArray({})
  @IsUrl({}, { each: true })
  urls: string[];
}
