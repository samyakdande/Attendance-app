import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string, user?: any }>();
    
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = 
      exception instanceof HttpException 
        ? exception.getResponse() 
        : { message: 'Internal Server Error' };

    const requestId = request.requestId || 'unknown-request';
    const userId = request.user?.id || 'anonymous';
    const institutionId = request.user?.institutionId || 'unknown';

    // Structured Error Log
    const logPayload = {
      requestId,
      timestamp: new Date().toISOString(),
      userId,
      institutionId,
      route: request.url,
      method: request.method,
      statusCode: status,
      errorName: exception instanceof Error ? exception.name : 'UnknownError',
      errorMessage: exception instanceof Error ? exception.message : 'Unknown exception',
      // Safe logging: Stack traces stay on server, never sent to client
      stackTrace: exception instanceof Error ? exception.stack : undefined
    };

    if (status >= 500) {
      this.logger.error(JSON.stringify(logPayload));
    } else {
      this.logger.warn(JSON.stringify(logPayload));
    }

    // Safe Response Format for Mobile Client
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
      error: errorResponse,
    });
  }
}
