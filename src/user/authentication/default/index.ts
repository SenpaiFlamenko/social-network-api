import { Router } from 'express';
import register from './register.js';
import login from './login.js';
import logout from './logout.js';
import { validate } from '../../../middleware/validate/index.js';
import { validateLogin, validateRegister } from '../../../validation-rules/sessions.js';

export const auth = Router();

auth.post('/register', validate(validateRegister), register);

auth.post('/login', validate(validateLogin), login);

auth.post('/logout', logout);
