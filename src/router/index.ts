import { Router } from 'express';
import { defaultRoute } from './defaultRoute.js';
import { auth } from '../user/authentication/default/index.js';
import { googleAuth } from '../user/authentication/googleAuth.js';
import { facebookAuth } from '../user/authentication/facebookAuth.js';
import { users } from '../user/index.js';
import { social } from '../user/social/index.js';
import { posts } from '../post/index.js';
import { comments } from '../post/comments/index.js';

export const router = Router();

router.use(defaultRoute);
router.use(auth);
router.use('/auth/google', googleAuth);
router.use('/auth/facebook', facebookAuth);
router.use('/id', users);
router.use('/social', social);
router.use('/posts', posts);
router.use('/posts', comments);
