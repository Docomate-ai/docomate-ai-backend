import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiModule } from 'src/ai/ai.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [AiModule, ProjectsModule, UsersModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
