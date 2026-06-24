import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    
    // Inject Correlation ID
    request.requestId = randomUUID();
    const requestId = request.requestId;

    const user = request.user || {};
    const userId = user.id || 'anonymous';
    const institutionId = user.institutionId || 'unknown';

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const responseTime = Date.now() - now;

        const logPayload = {
          requestId,
          timestamp: new Date().toISOString(),
          userId,
          institutionId,
          route: url,
          method,
          statusCode,
          responseTime,
        };

        this.logger.log(JSON.stringify(logPayload));
      }),
    );
  }
}
