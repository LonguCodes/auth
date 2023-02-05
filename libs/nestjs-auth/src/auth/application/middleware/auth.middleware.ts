import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { KeyRepository } from '../../infrastructure/repository/key.repository';
import { CustomRequest, UserDto } from '@longucodes/auth-core';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly keyRepository: KeyRepository) {}

  async use(
    req: CustomRequest<UserDto>,
    res: any,
    next: (error?: any) => void
  ): Promise<any> {
    const header = req.headers['authorization'];
    if (!header || header.length === 0) return next();
    if (!header.startsWith('Bearer')) return next(new UnauthorizedException());
    const token = header.substring(7);
    const publicKey = await this.keyRepository.getPublicKey();
    try {
      const payload = (await jwt.verify(token, publicKey)) as jwt.JwtPayload;
      if (payload)
        req.user = {
          id: payload.sub,
          email: payload.email,
          roles: payload.roles,
        };
    } catch (e) {
      return next(new UnauthorizedException());
    }

    return next();
  }
}
