import { Router, Response } from 'express';
import User from './model.js';
import { validateToken, AuthenticatedRequest } from '../middleware/tokenValidation.js';
import search from './search.js';
import show from './show.js';
import update from './update.js';
import remove from './remove.js';

export const users = Router();

users.get('/search', search);

users.get('/:id', show);

//@ts-ignore
users.put('/:id', validateToken, update);

//@ts-ignore
users.delete('/:id', validateToken, remove);
