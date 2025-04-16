import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EmbeddingsService } from 'src/ai/embeddings.service';
import axios from 'axios';
import { ProjectsRepository } from './projects.repository';
import { UsersService } from 'src/users/users.service';
import { getUsernameRepository } from './utils/retrieveNameRepo.util';
import { ObjectId } from 'mongodb';
import { scrapeRepositoryToPlainText } from './utils/git-scraper.util';

@Injectable()
export class ProjectsService {
  constructor(
    private EmbeddingService: EmbeddingsService,
    private projectRepo: ProjectsRepository,
    private usersService: UsersService,
  ) {}

  async getAllProject(userMail: string) {
    try {
      // check if user exist
      const user = await this.usersService.findByMail(userMail);
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      // get all the projects of the user
      const projects = await this.projectRepo.getAllProjectsByUser(user._id);

      // send array of project details [_id, projectName, repoUrl and languages]
      const filteredProjects = projects.map((project) => ({
        id: project._id,
        projectName: project.projectName,
        repoUrl: project.repoUrl,
        languages: project.languages,
      }));

      return {
        message: `Projects of ${user.name}`,
        data: { projects: filteredProjects },
      };
    } catch (error) {
      console.error(
        `Error in projectsService: getAllProject: \n ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProjectById(projectId: string, userId: string) {
    const _id = new ObjectId(projectId);
    const user_id = new ObjectId(userId);
    const project = await this.projectRepo.getProjectById(_id, user_id);
    if (project) {
      const filteredProject = {
        id: project._id,
        projectName: project.projectName,
        repoUrl: project.repoUrl,
        languages: project.languages,
      };
      return {
        message: `project ${project?.projectName} successfully retrieved`,
        data: { project: filteredProject },
      };
    }
    // if project does not exist throw error
    throw new NotFoundException('Project with this id does not exist');
  }

  async addProject(
    repoUrl: string,
    projectName: string,
    userMail: string,
    userId: string,
  ) {
    // is repository url and project name truthy
    if (!repoUrl || !projectName) {
      throw new BadRequestException(
        'Repository URL and Project Name are compulsory.',
      );
    }
    // validate user existance
    const user = await this.usersService.findByMail(userMail);
    if (!user) {
      throw new UnauthorizedException('Unauthorized access detected');
    }

    try {
      // check whether project exist with same name
      const userProjects = await this.projectRepo.getProjectByName(
        userId,
        projectName,
      );
      if (userProjects.length !== 0) {
        throw new BadRequestException(
          `Project with name ${projectName} already exist`,
        );
      }

      // retrieve username and repository name from repository url
      const [username, repository] = getUsernameRepository(repoUrl);

      // scrape the repository content
      const textFile: string = await scrapeRepositoryToPlainText(repoUrl, [
        '.git',
        'public',
        'node_modules',
      ]);
      await this.EmbeddingService.generateEmbeddingsData(textFile);

      // create the embeddings
      const [texts, embedds] =
        await this.EmbeddingService.generateEmbeddingsData(textFile);

      // fetch repo languages
      const languages: Record<string, number> = await axios
        .get(`https://api.github.com/repos/${username}/${repository}/languages`)
        .then((res) => res.data);

      // create and save the project entity (name, repo_url, languages)
      const project = await this.projectRepo.createProject(
        projectName,
        repoUrl,
        languages,
        texts,
        embedds,
        userId,
      );
      // return response
      return { message: `${project.projectName} has been created` };
    } catch (error) {
      console.error(
        `Error in projectsService: addProject: \n ${error.message}`,
      );
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteProject(projectName: string, userId: string) {
    try {
      // find and validate project name
      const project = await this.projectRepo.getProjectByName(
        userId,
        projectName,
      );

      if (project.length === 0) {
        throw new NotFoundException('Project does not exist');
      }
      // delete the project
      await this.projectRepo.deleteProject(project[0]._id);
      // send response
      return { message: `project ${project[0].projectName} has been deleted` };
    } catch (error) {
      console.error(
        `Error in projectsService: deleteProject: \n ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
