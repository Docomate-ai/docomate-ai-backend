import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content, Project } from '../entities';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectRepository(Project)
    private projectRepo: MongoRepository<Project>,
    @InjectRepository(Content)
    private contentRepo: MongoRepository<Content>,
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
      await this.contentRepo.delete({ projectId: _id });
      const project = await this.projectRepo.delete(_id);
      return project;
    } catch (error) {
      console.error(
        `Error updating project at ProjectRepository: in deleteProject \n ${error}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async similaritySearch(queryVector: number[], projectId: string) {
    try {
      // Fetch the specific project by its ID
      const project = await this.projectRepo.findOne({
        where: { _id: new ObjectId(projectId) },
      });

      if (!project) {
        throw new InternalServerErrorException(
          `Project with ID ${projectId} not found.`,
        );
      }

      if (!project.embeddings || !project.texts) {
        throw new InternalServerErrorException(
          `Project with ID ${projectId} does not have embeddings or texts.`,
        );
      }

      // Helper function to calculate cosine similarity
      const calculateCosineSimilarity = (
        vectorA: number[],
        vectorB: number[],
      ): number => {
        const dotProduct = vectorA.reduce(
          (sum, a, i) => sum + a * vectorB[i],
          0,
        );
        const magnitudeA = Math.sqrt(
          vectorA.reduce((sum, a) => sum + a * a, 0),
        );
        const magnitudeB = Math.sqrt(
          vectorB.reduce((sum, b) => sum + b * b, 0),
        );
        return dotProduct / (magnitudeA * magnitudeB);
      };

      // Calculate similarity for all embeddings
      const similarities = project.embeddings.map((embedding, index) => {
        const similarity = calculateCosineSimilarity(queryVector, embedding);
        return { similarity, index };
      });

      // Sort by similarity in descending order
      similarities.sort((a, b) => b.similarity - a.similarity);

      // Get the two most similar results
      const topResults = similarities.slice(0, 3);

      // Collect results with neighboring texts
      const results = topResults.map((result) => {
        const { index, similarity } = result;

        return {
          similarity,
          matchedText: project.texts[index],
          frontNeighbor: index > 0 ? project.texts[index - 1] : null, // Text before the match
          backNeighbor:
            index < project.texts.length - 1 ? project.texts[index + 1] : null, // Text after the match
        };
      });

      return results;
    } catch (error) {
      console.error(
        `Error performing similarity search at ProjectRepository: in similaritySearch \n ${error}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
