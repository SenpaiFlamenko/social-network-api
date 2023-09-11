import { Router } from 'express';
import { validateToken } from '../../middleware/tokenValidation.js';
import create from './create.js';
import update from './update.js';
import remove from './remove.js';
import { validate } from '../../middleware/validate/index.js';
import { validateCreate, validateUpdate } from '../../validation-rules/comment.js';

export const comments = Router();

//@ts-ignore
comments.post('/:id/newComment', validateToken, validate(validateCreate), create);

//@ts-ignore
comments.put('/:postId/comment/:id', validateToken, validate(validateUpdate), update);

//@ts-ignore
comments.delete('/:postId/comment/:id', validateToken, remove);
