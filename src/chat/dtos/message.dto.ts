import { IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  query: string;
}
