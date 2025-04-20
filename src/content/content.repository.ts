import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '../entities';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class ContentRepository {
  constructor(
    @InjectRepository(Content)
    private contentRepo: MongoRepository<Content>,
  ) {}

  async saveContent(
    contentName: string,
    contentType: string,
    content: string,
    project_id: ObjectId,
  ) {
    try {
      const contentInstance = this.contentRepo.create({
        contentName,
        contentType,
        content,
        projectId: project_id,
      });

      await this.contentRepo.save(contentInstance);
    } catch (error) {
      console.error(`Error in ContentRepository: at saveContent`);
    }
  }

  async findById(contentId: ObjectId) {
    const content = this.contentRepo.findOne({ where: { _id: contentId } });
    return content;
  }

  async findByProjectId(projectId: ObjectId) {
    const contents = await this.contentRepo.find({
      where: { projectId: projectId },
    });
    return contents;
  }

  async deleteContent(contentId: ObjectId) {
    const content = await this.contentRepo.delete({ _id: contentId });
    return content;
  }
}
