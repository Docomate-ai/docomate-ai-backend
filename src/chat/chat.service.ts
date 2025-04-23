import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from 'src/ai/embeddings.service';
import { GroqService } from 'src/ai/groq.service';
import { ProjectsRepository } from 'src/projects/projects.repository';

@Injectable()
export class ChatService {
  constructor(
    private EmbdsService: EmbeddingsService,
    private GroqService: GroqService,
    private ProjectRepo: ProjectsRepository,
  ) {}

  async generateChat(message: string, projectid: string) {
    const system = `You are Docomate-AI, an expert software engineer and documentation specialist. Your role is to help users understand and navigate their codebase with ease. Given the context of the codebase and a user's query, you provide helpful, human-like explanations in a conversational tone—like a friendly, knowledgeable teammate.

    If the provided code context is insufficient to fully answer the query, and the question is general, use your expertise to give the best possible answer. If more information is required, politely ask the user to clarify their query—ideally with an example, or by sharing the relevant file names and function names where they are experiencing the issue.`;

    const queryEmbeddingsReponse =
      await this.EmbdsService.JINA_GenerateEmbeddings([message]);

    const queryEmbeddings = queryEmbeddingsReponse.data.data[0].embedding;

    const semanticSearchResult = await this.ProjectRepo.similaritySearch(
      queryEmbeddings,
      projectid,
    );

    const context = semanticSearchResult
      .map(
        (item) =>
          `${item.frontNeighbor || ''}${item.matchedText}${
            item.backNeighbor || ''
          }`,
      )
      .join('');

    const response = await this.GroqService.generateWithContext(
      system,
      context,
      message,
    );

    return { data: response };
  }
}
