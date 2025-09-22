import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        // If the handler already returned the standard response shape,
        // return it unchanged (avoid double-wrapping).
        if (
          data &&
          typeof data === 'object' &&
          Object.prototype.hasOwnProperty.call(data, 'success') &&
          Object.prototype.hasOwnProperty.call(data, 'data')
        ) {
          return data;
        }

        // Otherwise wrap the raw response in the standard shape and add metadata.
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          path: req.url,
        };
      }),
    );
  }
}
