// apps/api/src/common/interceptors/errors.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorsInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      catchError((err) => {
        const status = err.getStatus ? err.getStatus() : 500;
        const message = err.response?.message || err.message || 'Internal server error';

        this.logger.error(
          `Error in ${req.method} ${req.url}: ${message}`,
          err.stack,
        );

        res.status(status).json({
          success: false,
          statusCode: status,
          error: message,
          timestamp: new Date().toISOString(),
          path: req.url,
        });

        return new Observable(); // prevent further propagation
      }),
    );
  }
}
