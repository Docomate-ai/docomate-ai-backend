import { Module } from '@nestjs/common';
import { GroqService } from './groq.service';
import { EmbeddingsService } from './embeddings.service';

@Module({
  exports: [GroqService, EmbeddingsService],
  providers: [GroqService, EmbeddingsService],
})
export class AiModule {}
