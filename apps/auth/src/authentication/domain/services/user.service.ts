import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMissingError } from '../errors/user-missing.error';
import {
  ChangeRoleEvent,
  TokenTypeEnum,
  ValidatedEvent,
} from '@longucodes/auth-core';
import { DateTime } from 'luxon';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserAlreadyValidatedError } from '../errors/user-already-validated.error';
import { CryptoService } from '../../../crypto/domain/service/crypto.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly emitter: EventEmitter2,
    private readonly cryptoService: CryptoService
  ) {}

  public async getUserById(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  public async addUserRole(userId: string, role: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserMissingError('User does not exist');

    const newRoles = [...new Set(...user.roles, role.toLowerCase())];

    await this.userRepository.save({
      ...user,
      roles: newRoles,
    });

    this.emitter.emit(ChangeRoleEvent.Name, {
      name: ChangeRoleEvent.Name,
      payload: {
        id: user.id,
        email: user.email,
        date: DateTime.now().toJSDate(),
        previousRoles: user.roles,
        currentRoles: newRoles,
      },
    });
  }
  public async removeUserRole(userId: string, role: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserMissingError('User does not exist');

    const newRoles = user.roles.filter(
      (userRole) => userRole !== role.toLowerCase()
    );

    await this.userRepository.save({
      ...user,
      roles: newRoles,
    });

    this.emitter.emit(ChangeRoleEvent.Name, {
      name: ChangeRoleEvent.Name,
      payload: {
        id: user.id,
        email: user.email,
        date: DateTime.now().toJSDate(),
        previousRoles: user.roles,
        currentRoles: newRoles,
      },
    });
  }

  public async validateUser(token: string) {
    const { sub: userId } = this.cryptoService.validateToken(
      token,
      TokenTypeEnum.Validation
    );

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserMissingError('User does not exist');
    if (user.validated)
      throw new UserAlreadyValidatedError('User is already validated');
    await this.userRepository.save({ ...user, validated: true });

    this.emitter.emit(ValidatedEvent.Name, {
      name: ValidityState.name,
      payload: {
        id: user.id,
        email: user.email,
        date: DateTime.now().toJSDate(),
      },
    });
  }

  async generateValidationToken(userId: string) {
    return this.cryptoService.createToken({
      sub: userId,
      type: TokenTypeEnum.Validation,
      exp: { day: 1 },
    });
  }
}
