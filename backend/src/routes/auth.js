import express from 'express';
import {
  register,
  login,
  getProfile,
  logout
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;
