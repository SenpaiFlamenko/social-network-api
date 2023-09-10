import { Router } from 'express';
import { validateToken } from '../middleware/tokenValidation.js';
import create from './create.js';
import show from './show.js';
import update from './update.js';
import like from './like.js';
import timeline from './timeline.js';
import remove from './remove.js';

export const posts = Router();

//@ts-ignore
posts.post('/create', validateToken, create);

posts.get('/:id', show);

//@ts-ignore
posts.put('/:id', validateToken, update);

//@ts-ignore
posts.post('/:id/like', validateToken, like);

//@ts-ignore
posts.get('/timeline', validateToken, timeline);

//@ts-ignore
posts.delete('/:id', validateToken, remove);
