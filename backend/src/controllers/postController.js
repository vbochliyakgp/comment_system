import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

/**
 * Get all posts
 */
export const getPosts = async (req, res) => {
  try {
    const {
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = 20,
      skip = 0,
    } = req.query;

    const userId = req.user._id;
    const posts = await Post.getPosts({
      sortBy,
      sortOrder,
      limit: parseInt(limit),
      skip: parseInt(skip),
    });

    const postsWithUpvoteStatus = posts.map((post) => {
      const postObj = post.toObject ? post.toObject() : post;
      postObj.hasUpvoted = post.upvotedBy.some(
        (id) => id.toString() === userId.toString()
      );
      return postObj;
    });

    res.json({
      success: true,
      data: {
        posts: postsWithUpvoteStatus,
        count: posts.length,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching posts",
    });
  }
};

/**
 * Upvote a post
 */
export const upvotePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const hasUpvoted = post.upvotedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (hasUpvoted) {
      post.upvotedBy = post.upvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      post.upvotes = Math.max(0, post.upvotes - 1);
    } else {
      post.upvotedBy.push(userId);
      post.upvotes += 1;
    }

    await post.save();

    res.json({
      success: true,
      message: hasUpvoted ? "Upvote removed" : "Post upvoted successfully",
      data: {
        upvotes: post.upvotes,
        hasUpvoted: !hasUpvoted,
      },
    });
  } catch (error) {
    console.error("Upvote post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while upvoting post",
    });
  }
};

/**
 * Get post with comments
 */
export const getPostWithComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { sortBy = "upvotes", sortOrder = "desc" } = req.query;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comments = await Comment.getCommentsForPost(id, {
      sortBy,
      sortOrder,
    });

    const postObj = post.toObject ? post.toObject() : post;
    postObj.hasUpvoted = post.upvotedBy.some(
      (id) => id.toString() === userId.toString()
    );

    const commentsWithUpvoteStatus = comments.map((comment) => {
      const commentObj = comment.toObject ? comment.toObject() : comment;
      commentObj.hasUpvoted = comment.upvotedBy.some(
        (id) => id.toString() === userId.toString()
      );
      return commentObj;
    });

    console.log("returning comments length", commentsWithUpvoteStatus.length);
    res.json({
      success: true,
      data: {
        post: postObj,
        comments: commentsWithUpvoteStatus,
      },
    });
  } catch (error) {
    console.error("Get post with comments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching post with comments",
    });
  }
};
