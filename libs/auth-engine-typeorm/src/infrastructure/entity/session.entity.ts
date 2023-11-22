import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISessionEntity } from '@longucodes/auth-engine-core';

@Entity({ name: 'session' })
export class SessionEntity implements ISessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;
}
