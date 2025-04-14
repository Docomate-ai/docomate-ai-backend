import { Module } from '@nestjs/common';
import { GroqService } from './groq.service';
import { HuggingFaceService } from './huggingFace.service';

@Module({
  exports: [GroqService, HuggingFaceService],
  providers: [GroqService, HuggingFaceService],
})
export class AiModule {}
