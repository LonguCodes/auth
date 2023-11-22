import { Inject, Injectable } from '@nestjs/common';
import { UserMissingError } from '../errors/user-missing.error';

import {
  RegisterEvent,
  TokenType,
  ValidatedEvent,
} from '@longucodes/auth-core';
import { DateTime } from 'luxon';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserAlreadyValidatedError } from '../errors/user-already-validated.error';
import { CryptoService } from '../../../crypto/domain/service/crypto.service';
import { ConfigToken } from '@longucodes/config';
import { ConfigInterface } from '../../../config/config.interface';
import {
  IUserEntity,
  IUserRepository,
  USER_REPOSITORY,
} from '@longucodes/auth-engine-core';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly emitter: EventEmitter2,
    private readonly cryptoService: CryptoService,
    @Inject(ConfigToken)
    private readonly config: ConfigInterface
  ) {}

  public async createUser(
    dto: Partial<IUserEntity>,
    claims?: Record<string, unknown>
  ) {
    const user = await this.userRepository.create({
      ...dto,
      validated: !this.config.user.validation || dto.validated,
    });

    this.emitter.emit(RegisterEvent.Name, {
      name: RegisterEvent.Name,
      payload: {
        id: user.id,
        email: dto.email,
        date: DateTime.now().toJSDate(),
        validated: user.validated,
        claims: claims,
      },
    });
    return user;
  }
  public async getUserById(id: string) {
    return this.userRepository.findById(id);
  }
  public async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  public async updateUser(dto: Partial<IUserEntity> & { id: string }) {
    return this.userRepository.update(dto.id, dto);
  }

  public async validateUser(token: string) {
    const { sub: id } = this.cryptoService.validateToken(
      token,
      TokenType.Validation
    );

    const user = await this.userRepository.findById(id);
    if (!user) throw new UserMissingError('User does not exist');
    if (user.validated)
      throw new UserAlreadyValidatedError('User is already validated');
    await this.userRepository.update(id, { validated: true });

    this.emitter.emit(ValidatedEvent.Name, {
      name: ValidatedEvent.Name,
      payload: {
        id: user.id,
        email: user.email,
        date: DateTime.now().toJSDate(),
      },
    });
  }

  async generateValidationToken(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserMissingError('User does not exist');
    return this.cryptoService.createToken({
      sub: id,
      type: TokenType.Validation,
      exp: { day: 1 },
    });
  }
}
