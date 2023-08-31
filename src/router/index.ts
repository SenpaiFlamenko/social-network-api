import { NextFunction, Request, Response, Router } from 'express';
import { defaultRoute } from './defaultRoute.js';
import { auth } from '../authentication/authentication.js';
import { posts } from '../posts/posts.js';
import { users } from '../users/usersRoute.js';
import { CustomError } from '../errors/errorHandling.js';

export const router = Router();

router.use(defaultRoute);
router.use(auth);
router.use('/posts', posts);
router.use('/id', users);

router.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(`Page ${req.originalUrl} does not exist`, 404);
  next(err);
});
