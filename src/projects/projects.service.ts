import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProjectsService {
  constructor(private configService: ConfigService) {}

  async addProject(repoUrl: string) {
    // create a temporary file
    // upload it to b2
    // add project entity to mongodb (with b2 url)
    // remove the temporary file
    // return success response
  }
}
