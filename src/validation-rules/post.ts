import { oneOf, query } from 'express-validator';
import { bodyStringExist, bodyStringOptional } from './index.js';

export const validateCreate = oneOf(
  [
    bodyStringExist('content').isLength({ max: 5000 }).withMessage("Post can't be longer than 5000 symbols!"),
    bodyStringExist('picture'),
  ],
  {
    message: "You can't create an empty post!",
  },
);

export const validateUpdate = oneOf(
  [
    bodyStringOptional('content').isLength({ max: 5000 }).withMessage("Post can't be longer than 5000 symbols!"),
    bodyStringOptional('picture'),
  ],
  {
    message: "You can't make your post empty!",
  },
);

export const validatePaginationQuery = [
  query('page')
    .exists()
    .withMessage("Page isn't selected")
    .bail()
    .isInt({ gt: 0 })
    .withMessage('Page should be greater then 0'),
  query('limit')
    .exists()
    .withMessage("Page limit wasn't passed")
    .bail()
    .isInt({ gt: 0 })
    .withMessage('Page limit should be greater then 0'),
];
