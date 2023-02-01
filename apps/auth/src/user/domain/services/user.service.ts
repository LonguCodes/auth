import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMissingError } from '../errors/user-missing.error';
import * as bcrypt from 'bcryptjs';

import {
  ChangePasswordEvent,
  ChangeRoleEvent,
  TokenTypeEnum,
  ValidatedEvent,
} from '@longucodes/auth-core';
import { DateTime } from 'luxon';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserAlreadyValidatedError } from '../errors/user-already-validated.error';
import { CryptoService } from '../../../crypto/domain/service/crypto.service';
import { InvalidOldPasswordError } from '../errors/invalid-old-password.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly emitter: EventEmitter2,
    private readonly cryptoService: CryptoService
  ) {}

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 4);
  }

  public async createUser(dto: Partial<UserEntity>) {
    const passwordHash = await this.hashPassword(dto.password);
    return this.userRepository.save({ ...dto, password: passwordHash });
  }
  public async getUserById(userId: string) {
    return this.userRepository.findOneBy({ id: userId });
  }
  public async getUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  public async addUserRole(userId: string, role: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserMissingError('User does not exist');

    const newRoles = [...new Set([...user.roles, role.toLowerCase()])];
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
        changeType: 'add',
        delta: [role],
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
        changeType: 'remove',
        delta: [role],
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
      name: ValidatedEvent.Name,
      payload: {
        id: user.id,
        email: user.email,
        date: DateTime.now().toJSDate(),
      },
    });
  }

  async generateValidationToken(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserMissingError('User does not exist');
    return this.cryptoService.createToken({
      sub: userId,
      type: TokenTypeEnum.Validation,
      exp: { day: 1 },
    });
  }

  public async generateChangePasswordToken(
    userId: string,
    oldPassword?: string
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserMissingError('User does not exist');

    if (oldPassword && !(await bcrypt.compare(oldPassword, user.password)))
      throw new InvalidOldPasswordError('Password does not match');
    return this.cryptoService.createToken({
      sub: userId,
      type: TokenTypeEnum.PasswordChange,
      exp: { day: 1 },
    });
  }

  public async changePassword(token: string, newPassword: string) {
    const { sub: userId } = this.cryptoService.validateToken(
      token,
      TokenTypeEnum.PasswordChange
    );

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserMissingError('User does not exist');

    await this.userRepository.save({
      ...user,
      password: await this.hashPassword(newPassword),
    });

    this.emitter.emit(ChangePasswordEvent.Name, {
      name: ChangePasswordEvent.Name,
      payload: {
        id: user.id,
        email: user.email,
        date: DateTime.now().toJSDate(),
      },
    });
  }
}
