import { Router, Request, Response } from 'express';
import User from '../model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { validateToken, UserAuthInfoInRequest } from '../../middleware/tokenValidation.js';

export const auth = Router();

const secret = process.env.JWT_SECRET || 'secret';

auth.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
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
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      secret,
      { expiresIn: '5m' },
    );
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

//testing private route
// auth.get('/protected', validateToken, (req: UserAuthInfoInRequest, res: Response) => {
//   return res.json({ user: req.user });
// });
