import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';

@Entity()
@Unique(['email'])
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
}
