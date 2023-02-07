import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from '@longucodes/auth-core';

@Entity({ name: 'auth_user' })
export class UserEntity implements UserDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ array: true, type: 'text' })
  roles: string[];

  @Column()
  password: string | undefined;

  @Column()
  validated: boolean;

  @Column({ name: 'plugin_properties', type: 'jsonb' })
  pluginProperties: Record<string, Record<string, any>>;
}
