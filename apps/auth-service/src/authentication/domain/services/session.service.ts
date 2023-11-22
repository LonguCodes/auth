import { Inject, Injectable } from '@nestjs/common';
import {
  ISessionRepository,
  SESSION_REPOSITORY,
} from '@longucodes/auth-engine-core';

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository
  ) {}

  public async startSession(userId: string) {
    await this.sessionRepository.deleteByUserId(userId);
    return this.sessionRepository.create({
      userId,
    });
  }

  public async getSession(id: string) {
    if (!id) return null;
    return this.sessionRepository.findById(id);
  }
}
