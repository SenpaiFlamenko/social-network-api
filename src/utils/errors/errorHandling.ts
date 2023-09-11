import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/index.js';

export enum ErrorCode {
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  conflict = 409,
  serverError = 500,
}

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const castErrorHandler = (error: any) => {
  const message = `Invalid value ${error.value} for field ${error.path}`;

  return new AppError(message, ErrorCode.badRequest);
};

const duplicateKeyErrorHandler = (error: any) => {
  const fields = Object.keys(error.keyPattern);
  const message = `Duplicate values on fields: ${fields.join(', ')}. Please use another values!`;

  return new AppError(message, ErrorCode.badRequest);
};

const validationErrorHandler = (error: any) => {
  const errors = Object.values(error.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(' ')}`;

  return new AppError(message, ErrorCode.badRequest);
};

const sendDevError = (res: Response, error: any) => {
  return res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const sendProdError = (res: Response, error: any) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  }
  return res.status(ErrorCode.serverError).json({
    status: 'error',
    message: 'Something went wrong! Please try again later.',
  });
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || ErrorCode.serverError;
  err.status = err.status || 'error';

  let error = { ...err, name: err.name };
  error.message = err.message;

  if (error.name === 'CastError') error = castErrorHandler(error);
  if (error.code === 11000) error = duplicateKeyErrorHandler(error);
  if (error.name === 'ValidationError') error = validationErrorHandler(error);

  return env === 'development' ? sendDevError(res, error) : sendProdError(res, error);
};
