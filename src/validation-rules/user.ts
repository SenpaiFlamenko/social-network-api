import { bodyStringExist, bodyStringOptional } from './index.js';
import { emailRegex, nameRegex, passwordRegex, usernameRegex } from './sessions.js';

export const validateSearch = [bodyStringExist('text')];

export const validateUpdate = [
  bodyStringOptional('username').matches(usernameRegex),
  bodyStringOptional('email').matches(emailRegex),
  bodyStringOptional('oldPassword')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long')
    .matches(passwordRegex)
    .withMessage('Password should include at least 1 each: letter, capital letter, number, special symbol'),
  bodyStringOptional('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long')
    .matches(passwordRegex)
    .withMessage('Password should include at least 1 each: letter, capital letter, number, special symbol'),
  bodyStringOptional('firstName').matches(nameRegex),
  bodyStringOptional('lastName').matches(nameRegex),
  bodyStringOptional('nickname'),
  bodyStringOptional('picture'),
];
