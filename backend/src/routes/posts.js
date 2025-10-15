import express from "express";
import {
  getPosts,
  upvotePost,
  getPostWithComments,
} from "../controllers/postController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getPosts);
router.get("/:id/comments", authenticate, getPostWithComments);
router.post("/:id/upvote", authenticate, upvotePost);

export default router;
