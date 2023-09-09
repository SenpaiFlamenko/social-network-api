import { Router, Request, Response } from 'express';
import User from '../model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../../utils/passwordHashing.js';
import { jwtSecret } from '../../config/index.js';

export const auth = Router();

auth.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, nickname } = req.body;
    //hash password
    const hashedPassword = await hashPassword(password);

    //create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      nickname,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

auth.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //does user exist?
    if (!password || !email) {
      return res.status(400).json(`All fields are mandatory`);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(`User with email: \"${email}\" does not exist!`);
    }

    //is it the right password?
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json('Wrong password!');
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '15m' },
    );
    res.status(200).cookie('access_token', accessToken, { httpOnly: true }).json('Logged in!');
  } catch (err) {
    res.status(500).json(err);
  }
});

auth.post('/logout', async (req: Request, res: Response) => {
  try {
    //delete access token from cookies
    res.clearCookie('access_token').status(200).json('Logged out!');
  } catch (err) {
    res.status(500).json(err);
  }
});
