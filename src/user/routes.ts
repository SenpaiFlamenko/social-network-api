import { Router, Request, Response } from 'express';
import User from './model.js';
import { validateToken, AuthenticatedRequest } from '../middleware/tokenValidation.js';
import { hashPassword } from '../utils/passwordHashing.js';

export const users = Router();

//@ts-ignore
users.get('/search', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const regex = new RegExp(text);

    const users = await User.find(
      {
        $or: [
          { username: { $regex: regex, $options: 'i' } },
          { firstName: { $regex: regex, $options: 'i' } },
          { lastName: { $regex: regex, $options: 'i' } },
          { nickname: { $regex: regex, $options: 'i' } },
        ],
      },
      { password: 0, email: 0, role: 0, updatedAt: 0 },
    );
    if (!users) {
      return res.status(404).json(`Can't find anyone!`);
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

users.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id, { password: 0, email: 0, role: 0, updatedAt: 0 });
    if (!user) {
      return res.status(404).json(`User does not exist!`);
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//@ts-ignore
users.put('/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json('You can update only your account!');
    }
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    await User.findByIdAndUpdate(req.user.id, {
      $set: req.body,
    });
    res.status(200).json('Account has been successfully updated!');
  } catch (err) {
    return res.status(500).json(err);
  }
});

//@ts-ignore
users.delete('/:id', validateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json('You can delete only your account!');
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('Account has been deleted');
  } catch (err) {
    return res.status(500).json(err);
  }
});
