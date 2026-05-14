import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from '../logger';
import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from './index';

type ErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function body(code: string, message: string, details?: unknown): ErrorBody {
  return details === undefined ? { error: { code, message } } : { error: { code, message, details } };
}

export function toHttpResponse(error: unknown): NextResponse<ErrorBody> {
  if (error instanceof ZodError) {
    return NextResponse.json(body('VALIDATION_ERROR', 'Invalid request', error.flatten()), { status: 400 });
  }
  if (error instanceof ValidationError) {
    return NextResponse.json(body(error.code, error.message, error.details), { status: 400 });
  }
  if (error instanceof UnauthorizedError) {
    return NextResponse.json(body(error.code, error.message), { status: 401 });
  }
  if (error instanceof ForbiddenError) {
    return NextResponse.json(body(error.code, error.message), { status: 403 });
  }
  if (error instanceof NotFoundError) {
    return NextResponse.json(body(error.code, error.message), { status: 404 });
  }
  if (error instanceof ConflictError) {
    return NextResponse.json(body(error.code, error.message), { status: 409 });
  }
  if (error instanceof AppError) {
    logger.error({ err: error }, 'AppError surfaced as 500');
    return NextResponse.json(body(error.code, error.message), { status: 500 });
  }
  logger.error({ err: error }, 'Unhandled error');
  return NextResponse.json(body('INTERNAL_ERROR', 'Internal server error'), { status: 500 });
}
