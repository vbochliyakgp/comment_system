import express from 'express';
import {
  createComment,
  updateComment,
  upvoteComment
} from '../controllers/commentController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validateComment } from '../middleware/validation.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', authenticate, validateComment, createComment);
router.put('/:id', authenticate, validateComment, updateComment);
router.post('/:id/upvote', authenticate, upvoteComment);

export default router;
