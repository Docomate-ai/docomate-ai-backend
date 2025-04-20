import { IsString } from 'class-validator';

export class SaveContentDto {
  @IsString()
  contentType: string;

  @IsString()
  contentName: string;

  @IsString()
  content: string;
}
