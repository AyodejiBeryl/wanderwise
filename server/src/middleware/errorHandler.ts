import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger.js';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Validation error',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  const appErr = err as AppError;
  appErr.statusCode = appErr.statusCode || 500;
  appErr.status = appErr.status || 'error';

  // Log error
  logger.error({
    message: appErr.message,
    stack: appErr.stack,
    statusCode: appErr.statusCode,
    path: req.path,
    method: req.method,
  });

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    res.status(appErr.statusCode!).json({
      success: false,
      status: appErr.status,
      message: appErr.message,
      stack: appErr.stack,
    });
  } else {
    // Production error response
    if (appErr.isOperational) {
      res.status(appErr.statusCode!).json({
        success: false,
        status: appErr.status,
        message: appErr.message,
      });
    } else {
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong',
      });
    }
  }
};

export class ApiError extends Error implements AppError {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
