import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AdminSecretToken } from '../../admin.tokens';

@Injectable()
export class AdminGuard implements CanActivate {
  public static readonly ADMIN_METADATA_KEY = Symbol();

  constructor(
    private readonly reflector: Reflector,
    @Inject(AdminSecretToken) private readonly secret: string
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAdminOnly: boolean = this.reflector.getAllAndOverride(
      AdminGuard.ADMIN_METADATA_KEY,
      [context.getClass(), context.getHandler()]
    );
    if (!isAdminOnly) return true;
    const request: Request = context.switchToHttp().getRequest();
    const header = request.headers['authorization'];
    return (
      header &&
      header.startsWith('Bearer') &&
      header.substring(7) === this.secret
    );
  }
}
