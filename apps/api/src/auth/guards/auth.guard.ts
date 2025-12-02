import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_ANONYMOUS_KEY } from '../decorators/anonymous.decorator';
import { SessionType } from '../types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (
      this.reflector.getAllAndOverride(IS_ANONYMOUS_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true;

    return super.canActivate(context);
  }

  handleRequest<TUser = SessionType>(err: any, user: TUser): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Unauthorized access: Expired or invalid JWT.',
        )
      );
    }

    return user;
  }
}
