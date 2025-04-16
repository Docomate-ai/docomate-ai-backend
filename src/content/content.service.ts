import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbeddingsService } from 'src/ai/embeddings.service';
import { CommunicationsModule } from 'src/communications/communications.module';
import { ProjectsRepository } from 'src/projects/projects.repository';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';
import { ObjectId } from 'mongodb';
import { sections as readmeSections } from './util/sections.util';
import sectionQueries from './util/sections-prompt.util';
import { GroqService } from 'src/ai/groq.service';

@Injectable()
export class ContentService {
  constructor(
    private configService: ConfigService,
    private projectRepo: ProjectsRepository,
    private userService: UsersService,
    private groqService: GroqService,
    private embeddingService: EmbeddingsService,
  ) {}

  async getReadmeSections() {
    return { data: readmeSections };
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
        await this.embeddingService.JINA_GenerateEmbeddings(queryStrings);
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
          );
        }),
      );

      return {
        message: 'given readme sections has been generated',
        data: { sections: readmeSections },
      };
      // concat the content
      // return the result
    } catch (error) {
      console.error(
        `Error in contentService: generateReadme: \n ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
