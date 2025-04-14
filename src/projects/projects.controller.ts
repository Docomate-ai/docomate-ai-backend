import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/authorized.guard';
import { AddProjectDto } from './dtos/add-project.dto';
import { ValidateRepoPipe } from './pipes/validateRepoUrl.pipe';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectsController {
  @Post('projects')
  getAllProjects() {
    return 'all projects';
  }

  @Post(':id')
  getProject() {
    return 'project with id';
  }

  @Post()
  @UsePipes(ValidateRepoPipe)
  addProject(@Body() body: AddProjectDto) {}
}
