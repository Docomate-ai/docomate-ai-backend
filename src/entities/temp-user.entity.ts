import { Entity, ObjectIdColumn, ObjectId, Column, Unique } from 'typeorm';

@Entity()
export class TempUser {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'string', nullable: false })
  name: string;

  @Column({ type: 'string', nullable: false })
  email: string;

  @Column({ type: 'string', nullable: false })
  password: string;

  @Column({ type: 'string', nullable: false })
  groqApi: string;

  @Column({ type: 'string', nullable: false })
  jinaApi: string;

  @Column({ type: 'number', nullable: false })
  otp: number;

  @Column({ type: 'date' })
  otpExpires: Date;
}
