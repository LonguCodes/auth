import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator<boolean | undefined>(
  (required: boolean | undefined, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  }
);
