import { IsArray } from 'class-validator';

export class GenerateReadmeDto {
  @IsArray()
  sections: string[];
}
