import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserDto } from '@longucodes/auth-core';

@Injectable()
export class RoleGuard implements CanActivate {
  public static readonly ROLE_METADATA_KEY = Symbol();

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user: UserDto = context.switchToHttp().getRequest().user;
    const roles: string[] = this.reflector.getAllAndOverride(
      RoleGuard.ROLE_METADATA_KEY,
      [context.getClass(), context.getHandler()]
    );
    if (roles && user && !user.roles.find((role) => roles.includes(role)))
      throw new ForbiddenException();
    return true;
  }
}
