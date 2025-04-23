import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiModule } from 'src/ai/ai.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [AiModule, ProjectsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
