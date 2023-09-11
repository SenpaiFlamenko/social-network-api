import { bodyStringExist, bodyStringOptional } from './index.js';

export const validateCreate = [
  bodyStringExist('content').isLength({ max: 500 }).withMessage("Comment can't be longer than 500 symbols!"),
];

export const validateUpdate = [
  bodyStringOptional('content').isLength({ max: 500 }).withMessage("Comment can't be longer than 500 symbols!"),
];
