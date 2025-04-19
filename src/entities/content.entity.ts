import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Content {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  contentName: string;

  @Column()
  contentType: string;

  @Column()
  content: string;

  @Column()
  projectId: ObjectId;
}
