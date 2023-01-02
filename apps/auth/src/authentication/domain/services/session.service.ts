import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '../../infrastructure/entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>
  ) {}

  public async startSession(userId: string) {
    await this.sessionRepository.delete({ userId });
    return this.sessionRepository.save({
      userId,
    });
  }

  public async getSession(sessionId: string) {
    return this.sessionRepository.findOneBy({ id: sessionId });
  }
}
