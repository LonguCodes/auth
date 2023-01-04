import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  public static readonly PUBLIC_METADATA_KEY = Symbol();

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user;
    const isPublic: boolean = this.reflector.getAllAndOverride(
      AuthGuard.PUBLIC_METADATA_KEY,
      [context.getClass(), context.getHandler()]
    );
    if (!(isPublic || user)) throw new UnauthorizedException();
    return true;
  }
}
