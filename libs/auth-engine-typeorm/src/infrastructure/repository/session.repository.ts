import {
  ISessionEntity,
  ISessionRepository,
} from '@longucodes/auth-engine-core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from '../entity/session.entity';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repository: Repository<SessionEntity>
  ) {}

  create(entity: Partial<ISessionEntity>): Promise<ISessionEntity> {
    return this.repository.save(entity);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }

  findById(id: string): Promise<ISessionEntity> {
    return this.repository.findOneBy({ id });
  }
}
