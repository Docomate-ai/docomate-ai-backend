import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Session,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/authorized.guard';
import { AddProjectDto } from './dtos/add-project.dto';
import { ValidateRepoPipe } from './pipes/validateRepoUrl.pipe';
import { ProjectsService } from './projects.service';
import { JwtService } from '@nestjs/jwt';
import { DeleteProjectDto } from './dtos/delete-project.dto';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
    private jwtService: JwtService,
  ) {}

  @Post('projects')
  async getAllProjects(@Session() session: any) {
    const { email } = this.jwtService.verify(session.token);
    return this.projectsService.getAllProject(email);
  }

  @Post()
  @UsePipes(ValidateRepoPipe)
  async addProject(@Body() body: AddProjectDto, @Session() session: any) {
    const { email, sub: userId } = this.jwtService.verify(session.token);
    return this.projectsService.addProject(
      body.repoUrl,
      body.projectName,
      email,
      userId,
    );
  }

  @Delete()
  async deleteProject(@Body() body: DeleteProjectDto, @Session() session: any) {
    const { sub: userId } = this.jwtService.verify(session.token);
    return this.projectsService.deleteProject(body.projectName, userId);
  }

  @Post(':id')
  getProject(@Param('id') projectId: string, @Session() session: any) {
    const { sub: userId } = this.jwtService.verify(session.token);
    return this.projectsService.getProjectById(projectId, userId);
  }
}
