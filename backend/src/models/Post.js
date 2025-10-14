import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      maxlength: [10000, "Content cannot be more than 10000 characters"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: [100, "Author name cannot be more than 100 characters"],
    },
    upvotes: {
      type: Number,
      default: 0,
      min: [0, "Upvotes cannot be negative"],
    },
    downvotes: {
      type: Number,
      default: 0,
      min: [0, "Downvotes cannot be negative"],
    },
    commentCount: {
      type: Number,
      default: 0,
      min: [0, "Comment count cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Tag cannot be more than 30 characters"],
      },
    ],
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
postSchema.index({ createdAt: -1 });
postSchema.index({ upvotes: -1 });
postSchema.index({ isActive: 1 });

// Virtual for net score (upvotes - downvotes)
postSchema.virtual("netScore").get(function () {
  return this.upvotes - this.downvotes;
});

// Ensure virtual fields are serialized
postSchema.set("toJSON", { virtuals: true });

// Instance method to increment upvotes
postSchema.methods.incrementUpvotes = function () {
  this.upvotes += 1;
  return this.save();
};

// Instance method to increment downvotes
postSchema.methods.incrementDownvotes = function () {
  this.downvotes += 1;
  return this.save();
};

// Instance method to update comment count
postSchema.methods.updateCommentCount = function () {
  return mongoose
    .model("Comment")
    .countDocuments({ postId: this._id, isActive: true })
    .then((count) => {
      this.commentCount = count;
      return this.save();
    });
};

// Static method to get posts with pagination and sorting
postSchema.statics.getPosts = async function (options = {}) {
  const {
    sortBy = "createdAt",
    sortOrder = "desc",
    limit = 20,
    skip = 0,
    isActive = true,
  } = options;

  // Build sort object
  const sortObj = {};
  sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Build query
  const query = { isActive };

  try {
    const posts = await this.find(query)
      .sort(sortObj)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    return posts;
  } catch (error) {
    console.error("Error in getPosts static method:", error);
    throw error;
  }
};

const Post = mongoose.model("Post", postSchema);

export default Post;
