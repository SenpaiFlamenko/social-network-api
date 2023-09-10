import { jwtSecret } from '../config/index.js';
import jwt from 'jsonwebtoken';

export function createAccessToken(id: string, username: string, role: string) {
  return jwt.sign(
    {
      id: id,
      username: username,
      role: role,
    },
    jwtSecret,
    { expiresIn: '15m' },
  );
}
