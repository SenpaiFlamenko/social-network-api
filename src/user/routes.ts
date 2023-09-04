import { Router, Request, Response } from 'express';
import User from './model.js';
import { validateToken, UserAuthInfoInRequest } from '../middleware/tokenValidation.js';
import { passwordHashing } from '../services/passwordHashing.js';

export const users = Router();

users.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json(`User does not exist!`);
    }
    const { password, updatedAt, role, email, ...other } = user.toObject();
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

users.put('/:id', validateToken, async (req: UserAuthInfoInRequest, res: Response) => {
  if (req.params.id === req.user?.id || req.user?.role === 'admin') {
    try {
      if (req.body.password) {
        try {
          req.body.password = await passwordHashing(req.body.password);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      await User.findByIdAndUpdate(req.user?.id, {
        $set: req.body,
      });
      res.status(200).json('Account has been successfully updated!');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can update only your account!');
  }
});

users.delete('/:id', validateToken, async (req: UserAuthInfoInRequest, res: Response) => {
  if (req.params.id === req.user?.id || req.user?.role === 'admin') {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can delete only your account!');
  }
});
