import { IsUrl, IsString } from 'class-validator';

export class AddProjectDto {
  @IsString()
  projectName: string;

  @IsUrl()
  repoUrl: string;
}
