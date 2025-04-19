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
  urls: string[];

  @Column()
  password: string;
}
