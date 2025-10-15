import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { validationResult } from "express-validator";

/**
 * Create a new comment
 */
export const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { text, postId, parentId } = req.body;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }
    }

    const comment = new Comment({
      text,
      postId,
      userId,
      parentId: parentId || null,
    });

    await comment.save();

    await comment.populate("userId", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: {
        comment,
      },
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating comment",
    });
  }
};

/**
 * Upvote a comment
 */
export const upvoteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const hasUpvoted = comment.upvotedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (hasUpvoted) {
      comment.upvotedBy = comment.upvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      comment.upvotes = Math.max(0, comment.upvotes - 1);
    } else {
      comment.upvotedBy.push(userId);
      comment.upvotes += 1;
    }

    await comment.save();

    res.json({
      success: true,
      message: hasUpvoted ? "Upvote removed" : "Comment upvoted successfully",
      data: {
        upvotes: comment.upvotes,
        hasUpvoted: !hasUpvoted,
      },
    });
  } catch (error) {
    console.error("Upvote comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while upvoting comment",
    });
  }
};
