import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { B2Module } from 'src/b2/b2.module';
import { UsersModule } from 'src/users/users.module';
import { ProjectsRepository } from './projects.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities';
import { AiModule } from 'src/ai/ai.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ProjectsService, ProjectsRepository],
  controllers: [ProjectsController],
  imports: [
    B2Module,
    UsersModule,
    TypeOrmModule.forFeature([Project]),
    AiModule,
  ],
})
export class ProjectsModule {}
