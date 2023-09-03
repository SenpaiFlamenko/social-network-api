import { Router } from 'express';
import { defaultRoute } from './defaultRoute.js';
import { auth } from '../user/authentication/authentication.js';
import { posts } from '../post/routes.js';
import { users } from '../user/routes.js';

export const router = Router();

router.use(defaultRoute);
router.use(auth);
router.use('/posts', posts);
router.use('/id', users);
