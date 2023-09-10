import { Response, NextFunction } from 'express';
import Post from './model.js';
import { AuthenticatedRequest } from '../middleware/tokenValidation.js';
import { AppError, ErrorCode } from '../utils/errors/errorHandling.js';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.body.content && !req.body.picture) {
      throw new AppError(`Post can't have both no text and no image!`, ErrorCode.badRequest);
    }
    const newPost = new Post({ author: req.user.id, content: req.body.content, picture: req.body.picture });
    const post = await newPost.save();

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};
