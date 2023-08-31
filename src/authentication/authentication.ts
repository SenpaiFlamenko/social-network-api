import { Router, Request, Response } from 'express';
import User from '../users/usersModel.js';

export const auth = Router();

auth.post('/register', async (req: Request, res: Response) => {
  try {
    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

auth.post('/login', (req: Request, res: Response) => {
  res.send('login page');
});
