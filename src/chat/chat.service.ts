import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from 'src/ai/embeddings.service';
import { GroqService } from 'src/ai/groq.service';

@Injectable()
export class ChatService {
  constructor(
    private EmbdsService: EmbeddingsService,
    private GroqService: GroqService,
  ) {}
}
