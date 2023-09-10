import { Router, Request, Response } from 'express';
import User from '../model.js';
import bcrypt from 'bcrypt';
import { hashPassword } from '../../utils/passwordHashing.js';
import { createAccessToken } from '../../utils/sessions.js';

export const auth = Router();

auth.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, nickname } = req.body;
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      nickname,
    });

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

auth.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json(`All fields are mandatory`);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(`User with email: \"${email}\" does not exist!`);
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json('Wrong password!');
    }

    const accessToken = createAccessToken(user.id, user.username, user.role);
    res.status(200).cookie('access_token', accessToken, { httpOnly: true }).json('Logged in!');
  } catch (err) {
    res.status(500).json(err);
  }
});

auth.post('/logout', async (req: Request, res: Response) => {
  try {
    res.clearCookie('access_token').status(200).json('Logged out!');
  } catch (err) {
    res.status(500).json(err);
  }
});
