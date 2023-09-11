import { bodyStringExist, bodyStringOptional } from './index.js';

export const usernameRegex = /^[a-zA-Z]\w+$/;

export const emailRegex = /^\S+@\S+\.\S+$/;

export const nameRegex = /^(?=.*[a-zA-Z])[a-zA-Z '.-]*[A-Za-z][^-]$/;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\\\/\-\[\]`^=_<>;:,.+()'"#|@$!%*?&])[A-Za-z\d\\\/\-\[\]`^=_<>;:,.+()'"#|@$!%*?&]{6,}$/;

export const validateRegister = [
  bodyStringExist('username').matches(usernameRegex),
  bodyStringExist('email').matches(emailRegex),
  bodyStringExist('password')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long')
    .matches(passwordRegex)
    .withMessage('Password should include at least 1 each: letter, capital letter, number, special symbol'),
  bodyStringOptional('firstName').matches(nameRegex),
  bodyStringOptional('lastName').matches(nameRegex),
  bodyStringOptional('nickname'),
  bodyStringOptional('picture'),
];

export const validateLogin = [bodyStringExist('email').matches(emailRegex), bodyStringExist('password')];
