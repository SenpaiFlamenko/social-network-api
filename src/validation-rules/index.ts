import { body, ValidationChain } from 'express-validator';

export const bodyStringExist = (field: string): ValidationChain =>
  body(field).trim().exists().withMessage('should exist').bail().isString().withMessage('- should be a string.');

export const bodyStringOptional = (field: string): ValidationChain =>
  body(field).trim().optional().isString().withMessage('- should be a string.');
