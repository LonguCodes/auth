import * as jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigToken } from '@longucodes/config';
import { ConfigInterface } from '../../../config/config.interface';
import { CredentialsRequestDto } from '../../application/requests/credentials.request.dto';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import * as bcrypt from 'bcryptjs';
import { DuplicateEmailError } from '../errors/duplicate-email.error';
import { SessionService } from './session.service';
import { InvalidTokenError } from '../errors/invalid-token.error';
import { CryptoKeys, CryptoKeysToken } from '../../../crypto/crypto.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoginEvent, RegisterEvent } from '@longucodes/auth-core';

interface TokenPayload {
  sub: string;
  iat: number;
  email: string;
  exp: number;
  roles: string[];
}
interface RenewTokenPayload {
  sessionId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(ConfigToken)
    private readonly config: ConfigInterface,
    @Inject(CryptoKeysToken)
    private readonly cryptoKeys: CryptoKeys,
    private readonly sessionService: SessionService,
    private readonly emitter: EventEmitter2
  ) {}

  public async register(dto: CredentialsRequestDto) {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (user)
      throw new DuplicateEmailError('User with given email already exists');
    const passwordHash = await bcrypt.hash(dto.password, 4);
    const { id } = await this.userRepository.save({
      email: dto.email,
      password: passwordHash,
    });

    this.emitter.emit(RegisterEvent.Name, {
      name: RegisterEvent.Name,
      payload: { id, email: dto.email, date: DateTime.now().toJSDate() },
    });

    return this.loginUser(id);
  }

  public async loginUsingCredentials(dto: CredentialsRequestDto) {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user)
      throw new InvalidCredentialsError('Email or password does not match');
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch)
      throw new InvalidCredentialsError('Email or password does not match');
    return this.loginUser(user.id);
  }

  public async loginUser(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    const session = await this.sessionService.startSession(userId);

    const authPayload: TokenPayload = {
      sub: user.id,
      iat: DateTime.now().toUnixInteger(),
      exp: DateTime.now()
        .plus({ millisecond: this.config.crypto.tokenLifetime })
        .toUnixInteger(),
      email: user.email,
      roles: user.roles,
    };

    const renewPayload: RenewTokenPayload = {
      sessionId: session.id,
      exp: DateTime.now()
        .plus({ millisecond: this.config.crypto.renewLifetime })
        .toUnixInteger(),
      iat: DateTime.now().toUnixInteger(),
    };

    this.emitter.emit(LoginEvent.Name, {
      name: LoginEvent.Name,
      payload: {
        id: user.id,
        email: user.email,
        date: DateTime.now().toJSDate(),
      },
    });

    return {
      token: jwt.sign(authPayload, this.cryptoKeys.private, {
        algorithm: 'RS512',
      }),
      renewToken: jwt.sign(renewPayload, this.cryptoKeys.private, {
        algorithm: 'RS512',
      }),
    };
  }

  public async getUserFromToken(token: string): Promise<UserDto> {
    try {
      const payload: TokenPayload = jwt.verify(
        token,
        this.cryptoKeys.public
      ) as TokenPayload;
      const { sub, email } = payload;
      return { id: sub, email };
    } catch (e) {
      return null;
    }
  }
  public async renewToken(renewToken: string) {
    let payload: RenewTokenPayload = null;
    try {
      payload = jwt.verify(
        renewToken,
        this.cryptoKeys.public
      ) as RenewTokenPayload;
    } catch (e) {
      throw new InvalidTokenError('Token is invalid');
    }

    const session = await this.sessionService.getSession(payload.sessionId);

    if (!session) throw new InvalidTokenError('Token is invalid');
    return this.loginUser(session.userId);
  }
}
