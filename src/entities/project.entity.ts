import { ObjectId } from 'mongodb';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectIdColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['projectName'])
export class Project {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  projectName: string;

  @Column()
  repoUrl: string;

  @Column({ type: 'json' })
  languages: Record<string, number>;

  @Column({ type: 'json' })
  texts: string[][];

  @Column({ type: 'json' })
  embeddings: number[][];

  @Column()
  userId: ObjectId;
}
