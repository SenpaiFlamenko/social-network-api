import { Request, Response, NextFunction } from 'express';
import User from '../../model.js';
import { hashPassword } from '../../../utils/passwordHashing.js';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, firstName, lastName, nickname, picture } = req.body;
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      nickname,
      picture,
    });
    const user = await newUser.save();

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
