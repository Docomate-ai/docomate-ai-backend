import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersModule } from 'src/users/users.module';
import { ProjectsRepository } from './projects.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content, Project } from '../entities';
import { AiModule } from 'src/ai/ai.module';

@Module({
  providers: [ProjectsService, ProjectsRepository],
  controllers: [ProjectsController],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Project, Content]),
    AiModule,
  ],
  exports: [ProjectsRepository],
})
export class ProjectsModule {}
