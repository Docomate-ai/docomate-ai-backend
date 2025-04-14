import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, User } from '../entities';
import { MongoRepository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private projectRepo: MongoRepository<Project>,
    private usersService: UsersService,
  ) {}

  async getAllProjectsByUser(userMail: string) {
    try {
      // Find the user by email
      const user = await this.usersService.findByMail(userMail);
      const projects = await this.projectRepo.find({
        // where: { user: user._id },
        where: { user },
      });

      return projects;
    } catch (error) {
      console.error(
        `Error fetching projects at ProjectRepository: in getAllProjectsByUser \n ${error}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async createProject(projectName: string, fileUrl: string, user: User) {
    try {
      const project = this.projectRepo.create({
        projectName,
        fileUrl,
        user,
      });

      const res = await this.projectRepo.save(project);
      return res;
    } catch (error) {
      console.error(
        `Error creating project at ProjectRepository: in createProject \n ${error}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateProject(_id: string, newProject: Partial<Project>) {
    try {
      const project = await this.projectRepo.findOne({ where: { _id } });

      if (!project) {
        throw new InternalServerErrorException(
          `Project with ID ${_id} not found`,
        );
      }

      const updatedProject = this.projectRepo.merge(project, newProject);
      await this.projectRepo.save(updatedProject);

      return updatedProject;
    } catch (error) {
      console.error(
        `Error updating project at ProjectRepository: in updateProject \n ${error}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteProject(_id: string) {
    try {
      const project = await this.projectRepo.delete(_id);
      return project;
    } catch (error) {
      console.error(
        `Error updating project at ProjectRepository: in deleteProject \n ${error}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
