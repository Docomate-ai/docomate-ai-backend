import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectRepository(Project)
    private projectRepo: MongoRepository<Project>,
  ) {}

  async getProjectById(_id: ObjectId, userId: ObjectId) {
    try {
      const project = await this.projectRepo.findOne({
        where: { _id, userId },
      });
      return project;
    } catch (error) {
      console.error(
        `Error fetching projects at ProjectRepository: in getProjectById \n ${error}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProjectByName(userId: string, projectName: string) {
    try {
      const user_id = new ObjectId(userId);
      const projects = await this.projectRepo.find({
        where: { userId: user_id, projectName },
      });

      return projects;
    } catch (error) {
      console.error(
        `Error fetching projects at ProjectRepository: in getAllProjectsByUser \n ${error}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllProjectsByUser(_id: ObjectId) {
    try {
      const projects = await this.projectRepo.find({
        where: { userId: _id },
      });

      return projects;
    } catch (error) {
      console.error(
        `Error fetching projects at ProjectRepository: in getAllProjectsByUser \n ${error}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async createProject(
    projectName: string,
    repoUrl: string,
    languages: Record<string, number>,
    texts: any[],
    embeddings: any[],
    userId: string,
  ) {
    try {
      const project = this.projectRepo.create({
        projectName,
        repoUrl,
        languages,
        texts,
        embeddings,
        userId: new ObjectId(userId),
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

  async deleteProject(_id: ObjectId) {
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
