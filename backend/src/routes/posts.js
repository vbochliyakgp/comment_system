import express from 'express';
import {
  getPosts,
  upvotePost,
  getPostWithComments
} from '../controllers/postController.js';
import { optionalAuth, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getPosts);
router.get('/:id/comments', optionalAuth, getPostWithComments);

// Protected routes (require authentication)
router.post('/:id/upvote', authenticate, upvotePost);

export default router;
