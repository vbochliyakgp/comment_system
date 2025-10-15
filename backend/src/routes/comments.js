import express from "express";
import {
  createComment,
  upvoteComment,
} from "../controllers/commentController.js";
import { authenticate } from "../middleware/auth.js";
import { validateComment } from "../middleware/validation.js";

const router = express.Router();

router.post("/", authenticate, validateComment, createComment);
router.post("/:id/upvote", authenticate, upvoteComment);

export default router;
