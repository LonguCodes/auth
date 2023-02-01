import { DateTime } from 'luxon';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigToken } from '@longucodes/config';
import { ConfigInterface } from '../../../config/config.interface';
import { CredentialsRequestDto } from '../../application/requests/credentials.request.dto';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import * as bcrypt from 'bcryptjs';
import { DuplicateEmailError } from '../errors/duplicate-email.error';
import { SessionService } from './session.service';
import { InvalidTokenError } from '../errors/invalid-token.error';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  LoginEvent,
  RegisterEvent,
  TokenTypeEnum,
  UserDto,
} from '@longucodes/auth-core';

import { CryptoService } from '../../../crypto/domain/service/crypto.service';
import { UserService } from '../../../user/domain/services/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(ConfigToken)
    private readonly config: ConfigInterface,
    private readonly cryptoService: CryptoService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly emitter: EventEmitter2
  ) {}

  public async register(dto: CredentialsRequestDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (user)
      throw new DuplicateEmailError('User with given email already exists');
    const { id, validated } = await this.userService.createUser({
      email: dto.email,
      password: dto.password,
      validated: !this.config.user.validation,
    });

    this.emitter.emit(RegisterEvent.Name, {
      name: RegisterEvent.Name,
      payload: {
        id,
        email: dto.email,
        date: DateTime.now().toJSDate(),
        validated,
      },
    });

    return this.loginUser(id);
  }

  public async loginUsingCredentials(dto: CredentialsRequestDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user)
      throw new InvalidCredentialsError('Email or password does not match');
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch)
      throw new InvalidCredentialsError('Email or password does not match');
    return this.loginUser(user.id);
  }

  public async loginUser(userId: string) {
    const user = await this.userService.getUserById(userId);

    const session = await this.sessionService.startSession(userId);

    this.emitter.emit(LoginEvent.Name, {
      name: LoginEvent.Name,
      payload: {
        id: user.id,
        email: user.email,
        date: DateTime.now().toJSDate(),
        validated: user.validated,
      },
    });

    return {
      token: this.cryptoService.createToken({
        sub: user.id,
        exp: { millisecond: this.config.crypto.tokenLifetime },
        email: user.email,
        roles: user.roles,
        validated: user.validated,
        type: TokenTypeEnum.Auth,
      }),
      renewToken: this.cryptoService.createToken({
        sub: session.id,
        exp: { millisecond: this.config.crypto.renewLifetime },
        type: TokenTypeEnum.Renew,
      }),
    };
  }

  public async getUserFromToken(token: string): Promise<UserDto> {
    const { sub, email, roles } = this.cryptoService.validateToken(
      token,
      TokenTypeEnum.Auth
    );
    return { id: sub, email, roles };
  }
  public async renewToken(renewToken: string) {
    const { sessionId } = this.cryptoService.validateToken(
      renewToken,
      TokenTypeEnum.Renew
    );

    const session = await this.sessionService.getSession(sessionId);

    if (!session) throw new InvalidTokenError('Token is invalid');
    return this.loginUser(session.userId);
  }
}
