import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from '@longucodes/auth-core';
import { IUserEntity } from '@longucodes/auth-engine-core';

@Entity({ name: 'user' })
export class UserEntity implements UserDto, IUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  validated: boolean;

  @Column({ name: 'claims', type: 'jsonb' })
  claims: Record<string, Record<string, unknown>>;
}
