import { Router } from 'express';
import { validateToken } from '../middleware/tokenValidation.js';
import search from './search.js';
import show from './show.js';
import update from './update.js';
import remove from './remove.js';
import { validate } from '../middleware/validate/index.js';
import { validateSearch, validateUpdate } from '../validation-rules/user.js';

export const users = Router();

users.get('/search', validate(validateSearch), search);

users.get('/:id', show);

//@ts-ignore
users.put('/:id', validateToken, validate(validateUpdate), update);

//@ts-ignore
users.delete('/:id', validateToken, remove);
