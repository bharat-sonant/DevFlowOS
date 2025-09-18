// apps/api/src/common/guards/dev-only.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class DevOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (process.env.NODE_ENV !== 'development') {
      throw new ForbiddenException('This endpoint is only available in development mode');
    }
    return true;
  }
}
