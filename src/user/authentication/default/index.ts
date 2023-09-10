import { Router } from 'express';
import register from './register.js';
import login from './login.js';
import logout from './logout.js';

export const auth = Router();

auth.post('/register', register);

auth.post('/login', login);

auth.post('/logout', logout);
