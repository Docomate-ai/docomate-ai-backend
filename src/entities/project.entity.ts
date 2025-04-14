import { ObjectId } from 'mongodb';
import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Project {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  projectName: string;

  @Column()
  fileUrl: string;

  @Column()
  texts: [[string]];

  @Column()
  embeddings: [[number]];

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  user: User;
}
