import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { AiModule } from 'src/ai/ai.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from 'src/entities';
import { ContentRepository } from './content.repository';

@Module({
  providers: [ContentService, ContentRepository],
  controllers: [ContentController],
  imports: [
    AiModule,
    ProjectsModule,
    UsersModule,
    TypeOrmModule.forFeature([Content]),
  ],
})
export class ContentModule {}
