import { IUserEntity, IUserRepository } from '@longucodes/auth-engine-core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {}
  create(user: Partial<IUserEntity>): Promise<IUserEntity> {
    return this.repository.save(user);
  }

  findByEmail(email: string): Promise<IUserEntity> {
    return this.repository.findOneBy({ email });
  }

  findById(id: string): Promise<IUserEntity> {
    return this.repository.findOneBy({ id });
  }

  async update(id: string, updatePayload: Partial<IUserEntity>): Promise<void> {
    await this.repository.update({ id }, updatePayload);
  }
}
