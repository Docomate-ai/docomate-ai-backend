import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { B2Module } from 'src/b2/b2.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ProjectRepository } from './projects.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities';

@Module({
  providers: [ProjectsService, ProjectRepository],
  controllers: [ProjectsController],
  imports: [B2Module, UsersModule, TypeOrmModule.forFeature([Project])],
})
export class ProjectsModule {}
