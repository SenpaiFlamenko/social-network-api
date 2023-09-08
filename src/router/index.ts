import { Router } from 'express';
import { defaultRoute } from './defaultRoute.js';
import { auth } from '../user/authentication/authentication.js';
import { users } from '../user/routes.js';
import { social } from '../user/social/routes.js';
import { posts } from '../post/routes.js';
import { comments } from '../post/comments/routes.js';
import { googleAuth } from '../user/authentication/googleAuth.js';

export const router = Router();

router.use(defaultRoute);
router.use(auth);
router.use('/auth/google', googleAuth);
router.use('/posts', posts);
router.use('/posts', comments);
router.use('/id', users);
router.use('/social', social);
