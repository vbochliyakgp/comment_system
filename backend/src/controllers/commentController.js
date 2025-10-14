import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { validationResult } from "express-validator";

/**
 * Create a new comment
 */
export const createComment = async (req, res) => {
  try {
    // Check for validation errors
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

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // If parentId is provided, verify parent comment exists
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }
    }

    // Create comment
    const comment = new Comment({
      text,
      postId,
      userId,
      parentId: parentId || null,
    });

    await comment.save();

    // Populate user data
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
 * Update a comment
 */
export const updateComment = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Find comment
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user can edit (owner or admin)
    if (
      comment.userId.toString() !== userId.toString() &&
      userRole !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this comment",
      });
    }

    // Update comment
    comment.text = text;
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();

    res.json({
      success: true,
      message: "Comment updated successfully",
      data: {
        comment,
      },
    });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating comment",
    });
  }
};

/**
 * Upvote a comment
 */
export const upvoteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user has already upvoted
    const hasUpvoted = comment.upvotedBy.some(id => id.toString() === userId.toString());
    
    if (hasUpvoted) {
      // Remove upvote
      comment.upvotedBy = comment.upvotedBy.filter(id => id.toString() !== userId.toString());
      comment.upvotes = Math.max(0, comment.upvotes - 1);
    } else {
      // Add upvote
      comment.upvotedBy.push(userId);
      comment.upvotes += 1;
      
      // Remove from downvotes if user had downvoted
      if (comment.downvotedBy.some(id => id.toString() === userId.toString())) {
        comment.downvotedBy = comment.downvotedBy.filter(id => id.toString() !== userId.toString());
        comment.downvotes = Math.max(0, comment.downvotes - 1);
      }
    }

    await comment.save();

    res.json({
      success: true,
      message: hasUpvoted ? "Upvote removed" : "Comment upvoted successfully",
      data: {
        upvotes: comment.upvotes,
        downvotes: comment.downvotes,
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
