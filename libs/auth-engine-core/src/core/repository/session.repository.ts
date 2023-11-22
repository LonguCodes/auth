import { ISessionEntity } from '../entity';

export const SESSION_REPOSITORY = Symbol.for('session-repository');
export interface ISessionRepository {
  findById(id: string): Promise<ISessionEntity>;

  create(entity: Partial<ISessionEntity>): Promise<ISessionEntity>;
  deleteByUserId(userId: string): Promise<void>;
}
