import { body } from 'express-validator';

/**
 * Validation rules for user registration
 */
export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for comment creation
 */
export const validateComment = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters'),
  
  body('postId')
    .isMongoId()
    .withMessage('Valid post ID is required'),
  
  body('parentId')
    .optional()
    .isMongoId()
    .withMessage('Valid parent comment ID is required')
];


