import { Request, Response, NextFunction } from 'express';
import User from '../../model.js';
import bcrypt from 'bcrypt';
import { createAccessToken } from '../../../utils/sessions.js';
import { AppError, ErrorCode } from '../../../utils/errors/errorHandling.js';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      throw new AppError(`All fields are mandatory`, ErrorCode.badRequest);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(`User with email: \"${email}\" does not exist!`, ErrorCode.notFound);
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new AppError('Wrong password!', ErrorCode.badRequest);
    }

    const accessToken = createAccessToken(user.id, user.username, user.role);
    res.status(200).cookie('access_token', accessToken, { httpOnly: true }).json('Logged in!');
  } catch (err) {
    next(err);
  }
};
