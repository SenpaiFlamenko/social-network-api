import { Router } from 'express';
import { validateToken } from '../../middleware/tokenValidation.js';
import create from './create.js';
import update from './update.js';
import remove from './remove.js';

export const comments = Router();

//@ts-ignore
comments.post('/:id/newComment', validateToken, create);

//@ts-ignore
comments.put('/:postId/comment/:id', validateToken, update);

//@ts-ignore
comments.delete('/:postId/comment/:id', validateToken, remove);
