import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionType } from '../types';

export const Session = createParamDecorator(
  (key: keyof SessionType, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user || null;
    return key ? user?.[key] : user;
  },
);
