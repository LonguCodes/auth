import { IUserEntity } from '../entity';

export const USER_REPOSITORY = Symbol.for('user-repository');
export interface IUserRepository {
  findByEmail(email: string): Promise<IUserEntity>;
  findById(id: string): Promise<IUserEntity>;

  create(user: Partial<IUserEntity>): Promise<IUserEntity>;
  update(id: string, user: Partial<IUserEntity>): Promise<void>;
}
