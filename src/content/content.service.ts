import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createDecipheriv } from 'crypto';
import { Response } from 'express';
import { EmbeddingsService } from 'src/ai/embeddings.service';
import { ProjectsRepository } from 'src/projects/projects.repository';
import { UsersService } from 'src/users/users.service';
import { ObjectId } from 'mongodb';
import { sections as readmeSections } from './util/sections.util';
import sectionQueries from './util/sections-prompt.util';
import { GroqService } from 'src/ai/groq.service';
import { ContentRepository } from './content.repository';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContentService {
  private readonly FILE_DIR = path.join(__dirname, 'downloadStore');

  constructor(
    private projectRepo: ProjectsRepository,
    private userService: UsersService,
    private groqService: GroqService,
    private embeddingService: EmbeddingsService,
    private contentRepos: ContentRepository,
    private configService: ConfigService,
  ) {}

  async getReadmeSections() {
    return { data: readmeSections };
  }

  async getAllContents(projectId: string, userId: string) {
    const project_id = new ObjectId(projectId);
    const user_id = new ObjectId(userId);
    const project = await this.projectRepo.getProjectById(project_id, user_id);
    if (!project) {
      throw new NotFoundException('Project does not exist');
    }
    try {
      const contents = await this.contentRepos.findByProjectId(project_id);
      return {
        message: `Contents of ${projectId} projects`,
        data: { contents },
      };
    } catch (error) {
      console.error(
        `Error in ContentService: at getAllContents \n ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Something went wrong getting your content',
      );
    }
  }

  async generateReadme(
    projectId: string,
    userMail: string,
    sections: string[],
  ) {
    const user = await this.userService.findByMail(userMail);
    if (!user) {
      throw new NotFoundException('User with given mail does not exist');
    }
    const project = await this.projectRepo.getProjectById(
      new ObjectId(projectId),
      user._id,
    );
    if (!project) {
      throw new NotFoundException('Project with this id does not exist');
    }

    try {
      // decrypt the api keys
      // secrets to decrypt api keys
      const algorithm = this.configService.get<string>('CRYPTO_ALGORITHM');
      const secretKeyString =
        this.configService.get<string>('CRYPTO_SECRET_KEY');
      const ivString = this.configService.get<string>('CRYPTO_IV');
      if (!algorithm || !secretKeyString || !ivString) {
        throw new InternalServerErrorException(
          'Encryption configuration is missing',
        );
      }
      const secretKey = Buffer.from(secretKeyString, 'hex');
      const iv = Buffer.from(ivString, 'hex');
      const decipherGroq = createDecipheriv(algorithm, secretKey, iv);
      let decryptedGroqAPI =
        decipherGroq.update(user.groqApi, 'hex', 'utf8') +
        decipherGroq.final('utf8');
      const decipherJina = createDecipheriv(algorithm, secretKey, iv);
      let decryptedJinaAPI =
        decipherJina.update(user.jinaApi, 'hex', 'utf8') +
        decipherJina.final('utf8');
      // retrieve query-strings and prompts for each section
      const requiredSections = sectionQueries.filter((section) =>
        sections.includes(section.section),
      );
      const queryStrings = requiredSections.map(
        (section) => section.queryString,
      );
      const prompts = requiredSections.map((section) => section.prompt);
      // generate embedding for each query-string
      const queryStringsEmbeddingsResponse =
        await this.embeddingService.JINA_GenerateEmbeddings(
          queryStrings,
          decryptedJinaAPI,
        );
      const queryStringsEmbeddings =
        queryStringsEmbeddingsResponse.data.data.map(
          (obj: any) => obj.embedding,
        );
      // query the database to find matched context
      const contexts = await Promise.all(
        queryStringsEmbeddings.map(async (queryVector: number[]) => {
          const res = await this.projectRepo.similaritySearch(
            queryVector,
            projectId,
          );

          // Concatenate all matchedText and neighboring texts without any separator
          const concatenatedResults = res
            .map(
              (item) =>
                `${item.frontNeighbor || ''}${item.matchedText}${
                  item.backNeighbor || ''
                }`,
            )
            .join(''); // Join without any separator

          return concatenatedResults;
        }),
      );
      // pass all context and prompt to groq-sdk using promise.all()
      // Generate README sections for all required sections in parallel
      const readmeSections = await Promise.all(
        requiredSections.map((section, index) => {
          const system = `You are a GitHub README section generator. Given the project context and the prompt, your task is to generate a well-structured GitHub Flavored Markdown section specifically for the "${section.section}" part of a README. Use ## as the heading level, since this section will be integrated into a larger README document by the user. Do not include any additional text, explanations, or comments—only return the final markdown content.`;

          return this.groqService.generateWithContext(
            system,
            section.prompt,
            contexts[index],
            decryptedGroqAPI,
          );
        }),
      );

      // concat the content
      const readmeContent = readmeSections.join('\n');

      return {
        message: 'given readme sections has been generated',
        data: { readme: readmeContent },
      };
    } catch (error) {
      console.error(
        `Error in contentService: generateReadme: \n ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async saveContent(
    projectId: string,
    userId: string,
    contentName: string,
    contentType: string,
    content: string,
  ) {
    const project_id = new ObjectId(projectId);
    const user_id = new ObjectId(userId);
    const project = await this.projectRepo.getProjectById(project_id, user_id);
    if (!project) {
      throw new NotFoundException('Project does not exist');
    }

    try {
      await this.contentRepos.saveContent(
        contentName,
        contentType,
        content,
        project_id,
      );
      return { message: 'content saved successfuly' };
    } catch (error) {
      console.error(`Error at ContentService: in saveContent \n ${error}`);
      throw new InternalServerErrorException(
        'Something went wrong saving your content',
      );
    }
  }

  async deleteContentById(contentId: string) {
    try {
      const content_id = new ObjectId(contentId);
      await this.contentRepos.deleteContent(content_id);
    } catch (error) {
      console.error(
        `Error at ContentService: in deleteContentById \n ${error}`,
      );

      throw new InternalServerErrorException('Error deleting content');
    }
  }

  getFileExtension(contentType: string) {
    switch (contentType.toLowerCase()) {
      case 'readme':
        return '.md';
    }
  }

  async downloadContent(contentId: string, res: Response) {
    const content_id = new ObjectId(contentId);
    try {
      const content = await this.contentRepos.findById(content_id);
      if (!content) {
        throw new NotFoundException('Content does not exist');
      }

      // create and store file saving path
      const extension = this.getFileExtension(content.contentType);
      const safeFileName = content.contentName + uuidv4() + extension;
      const filePath = path.join(this.FILE_DIR, safeFileName);

      // Ensure folder exists
      if (!fs.existsSync(this.FILE_DIR)) {
        fs.mkdirSync(this.FILE_DIR, { recursive: true });
      }

      // write content into file
      fs.writeFileSync(filePath, content.content);

      // send file and delete after send
      res.download(filePath, safeFileName, (err) => {
        // deleting file
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(
              `Error in ContentService: at downloadContent \n ${unlinkErr}`,
            );
          }
        });

        if (err) {
          console.error(
            `Error in ContentService: at downloadContent \n ${err}`,
          );
          throw new InternalServerErrorException(err.message);
        }
      });
    } catch (error) {
      console.error(`Error in ContentService: at downloadContent \n ${error}`);
      throw new InternalServerErrorException(error.message);
    }
  }
}
