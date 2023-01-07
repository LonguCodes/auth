import { Inject, Injectable } from '@nestjs/common';
import { CryptoKeys, CryptoKeysToken } from '../token/keys.token';
import * as jwt from 'jsonwebtoken';
import { TokenPayloadInterface, TokenTypeEnum } from '@longucodes/auth-core';
import { DateTime } from 'luxon';
import { JwtPayload } from 'jsonwebtoken';
import { InvalidTokenError } from '../error/invalid-token.error';

@Injectable()
export class CryptoService {
  constructor(@Inject(CryptoKeysToken) private readonly keys: CryptoKeys) {}

  public createToken<T extends TokenPayloadInterface>(payload: T) {
    return jwt.sign(
      {
        ...payload,
        exp: DateTime.now().plus(payload.exp).toUnixInteger(),
        iat: DateTime.now().toUnixInteger(),
      },
      this.keys.private,
      { algorithm: 'RS512' }
    );
  }

  public validateToken<T extends TokenPayloadInterface = TokenPayloadInterface>(
    token: string,
    type?: TokenTypeEnum
  ): T {
    try {
      const payload = jwt.verify(token, this.keys.public) as JwtPayload as T;
      if (type && payload.type !== type)
        throw new InvalidTokenError('Token type does not match');
      return payload;
    } catch (e) {
      throw new InvalidTokenError(e);
    }
  }
}
