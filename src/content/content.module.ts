import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { AiModule } from 'src/ai/ai.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { B2Module } from 'src/b2/b2.module';
import { UsersModule } from 'src/users/users.module';
import { ProjectsRepository } from 'src/projects/projects.repository';

@Module({
  providers: [ContentService],
  controllers: [ContentController],
  imports: [AiModule, ProjectsModule, B2Module, UsersModule],
})
export class ContentModule {}
