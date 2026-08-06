import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface ErrorEnvelope {
  success: false;
  error: {
    statusCode: number;
    message: string | string[];
    error?: string;
    path: string;
    timestamp: string;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error: string | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const b = body as Record<string, unknown>;
        message = (b.message as string | string[]) ?? exception.message;
        error = b.error as string | undefined;
      }
    } else if (exception instanceof QueryFailedError) {
      const driverCode = (exception as QueryFailedError & { code?: string })
        .code;
      if (driverCode === '23505') {
        statusCode = HttpStatus.CONFLICT;
        message = 'A record with the same unique value already exists';
        error = 'Conflict';
      } else {
        this.logger.error(exception.message, exception.stack);
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(`Unknown exception: ${String(exception)}`);
    }

    const envelope: ErrorEnvelope = {
      success: false,
      error: {
        statusCode,
        message,
        ...(error ? { error } : {}),
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    };

    response.status(statusCode).json(envelope);
  }
}