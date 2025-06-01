import { createDecipheriv } from 'crypto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbeddingsService } from 'src/ai/embeddings.service';
import { GroqService } from 'src/ai/groq.service';
import { ProjectsRepository } from 'src/projects/projects.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    private EmbdsService: EmbeddingsService,
    private GroqService: GroqService,
    private ProjectRepo: ProjectsRepository,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async generateChat(message: string, projectid: string, userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const system = `You are Docomate-AI, an expert software engineer and documentation specialist. Your role is to help users understand and navigate their codebase with ease. Given the context of the codebase and a user's query, you provide helpful, human-like explanations in a conversational tone—like a friendly, knowledgeable teammate.

    If the provided code context is insufficient to fully answer the query, and the question is general, use your expertise to give the best possible answer. If more information is required, politely ask the user to clarify their query—ideally with an example, or by sharing the relevant file names and function names where they are experiencing the issue.`;

    // secrets to decrypt api keys
    const algorithm = this.configService.get<string>('CRYPTO_ALGORITHM');
    const secretKeyString = this.configService.get<string>('CRYPTO_SECRET_KEY');
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

    const queryEmbeddingsReponse =
      await this.EmbdsService.JINA_GenerateEmbeddings(
        [message],
        decryptedJinaAPI,
      );

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
      decryptedGroqAPI,
    );

    return { data: response };
  }
}
