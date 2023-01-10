import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from '../../domain/services/authentication.service';
import {CustomRequest, UserDto} from "@longucodes/auth-core";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async use(
    req: CustomRequest<UserDto>,
    res: any,
    next: (error?: any) => void
  ): Promise<any> {
    const header = req.headers['authorization'];
    if (!header || header.length === 0) return next();
    if (!header.startsWith('Bearer')) return next(new UnauthorizedException());
    const token = header.substring(7);

    const user = await this.authenticationService.getUserFromToken(token);
    if (user) req.user = user;
    return next();
  }
}
