import { DateTime } from 'luxon';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigToken } from '@longucodes/config';
import { ConfigInterface } from '../../../config/config.interface';
import { SessionService } from './session.service';
import { InvalidTokenError } from '../errors/invalid-token.error';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoginEvent, TokenType, UserDto } from '@longucodes/auth-core';

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
        validated: user.validated,
        type: TokenType.Auth,
      }),
      renewToken: this.cryptoService.createToken({
        sub: session.id,
        exp: { millisecond: this.config.crypto.renewLifetime },
        type: TokenType.Renew,
      }),
    };
  }

  public async getUserFromToken(token: string): Promise<UserDto> {
    const { sub, email } = this.cryptoService.validateToken(
      token,
      TokenType.Auth
    );
    return { id: sub, email };
  }
  public async renewToken(renewToken: string) {
    const { sub } = this.cryptoService.validateToken(
      renewToken,
      TokenType.Renew
    );

    const session = await this.sessionService.getSession(sub);

    if (!session) throw new InvalidTokenError('Token is invalid');
    return this.loginUser(session.userId);
  }
}
