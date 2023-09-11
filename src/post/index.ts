import { Router } from 'express';
import { validateToken } from '../middleware/tokenValidation.js';
import create from './create.js';
import show from './show.js';
import update from './update.js';
import like from './like.js';
import timeline from './timeline.js';
import remove from './remove.js';
import { validate } from '../middleware/validate/index.js';
import { validateCreate, validatePaginationQuery, validateUpdate } from '../validation-rules/post.js';

export const posts = Router();

//@ts-ignore
posts.post('/create', validateToken, validate(validateCreate), create);

//@ts-ignore
posts.get('/timeline', validateToken, validate(validatePaginationQuery), timeline);

posts.get('/:id', show);

//@ts-ignore
posts.put('/:id', validateToken, validate(validateUpdate), update);

//@ts-ignore
posts.delete('/:id', validateToken, remove);

//@ts-ignore
posts.post('/:id/like', validateToken, like);
