import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/authorized.guard';
import { AddProjectDto } from './dtos/add-project.dto';
import { ValidateRepoPipe } from './pipes/validateRepoUrl.pipe';
import { ProjectsService } from './projects.service';
import { JwtService } from '@nestjs/jwt';
import { DeleteProjectDto } from './dtos/delete-project.dto';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
    private jwtService: JwtService,
  ) {}

  @Post('projects')
  async getAllProjects(@Req() req: Request) {
    const token = req.cookies?.token;
    const { email } = this.jwtService.verify(token);
    return this.projectsService.getAllProject(email);
  }

  @Post()
  @UsePipes(ValidateRepoPipe)
  async addProject(@Body() body: AddProjectDto, @Req() req: Request) {
    const token = req.cookies?.token;
    const { email, sub: userId } = this.jwtService.verify(token);
    return this.projectsService.addProject(
      body.repoUrl,
      body.projectName,
      email,
      userId,
    );
  }

  @Delete()
  async deleteProject(@Body() body: DeleteProjectDto, @Req() req: Request) {
    const token = req.cookies?.token;
    const { sub: userId } = this.jwtService.verify(token);
    return this.projectsService.deleteProject(body.projectName, userId);
  }

  @Post(':id')
  getProject(@Param('id') projectId: string, @Req() req: Request) {
    const token = req.cookies?.token;
    const { sub: userId } = this.jwtService.verify(token);
    return this.projectsService.getProjectById(projectId, userId);
  }
}
