import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [2000, "Comment cannot be more than 2000 characters"],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post ID is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // null for top-level comments
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
    replyCount: {
      type: Number,
      default: 0,
      min: [0, "Reply count cannot be negative"],
    },
    depth: {
      type: Number,
      default: 0,
      min: [0, "Depth cannot be negative"],
      max: [10, "Maximum nesting depth is 10 levels"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
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

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1, createdAt: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ isActive: 1 });
commentSchema.index({ depth: 1 });

commentSchema.virtual("netScore").get(function () {
  return this.upvotes - this.downvotes;
});

// Virtual for path (useful for nested comments)
commentSchema.virtual("path").get(function () {
  return this.parentId ? `${this.parentId}/${this._id}` : this._id.toString();
});

// Ensure virtual fields are serialized
commentSchema.set("toJSON", { virtuals: true });

// Pre-save middleware to calculate depth
commentSchema.pre("save", async function (next) {
  if (this.isNew && this.parentId) {
    try {
      const parentComment = await this.constructor.findById(this.parentId);
      if (parentComment) {
        this.depth = parentComment.depth + 1;

        // Prevent too deep nesting
        if (this.depth > 10) {
          return next(new Error("Maximum nesting depth exceeded"));
        }
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Post-save middleware to update parent's reply count
commentSchema.post("save", async function (doc) {
  if (doc.parentId) {
    try {
      await this.constructor.updateOne(
        { _id: doc.parentId },
        { $inc: { replyCount: 1 } }
      );
    } catch (error) {
      console.error("Error updating parent reply count:", error);
    }
  }
});

// Instance method to increment upvotes
commentSchema.methods.incrementUpvotes = function () {
  this.upvotes += 1;
  return this.save();
};

// Instance method to increment downvotes
commentSchema.methods.incrementDownvotes = function () {
  this.downvotes += 1;
  return this.save();
};

// Instance method to get nested replies
commentSchema.methods.getReplies = function () {
  return this.constructor
    .find({
      parentId: this._id,
      isActive: true,
    })
    .populate("userId", "name avatar")
    .sort({ createdAt: 1 });
};

// Static method to get comments for a post with nested structure
commentSchema.statics.getCommentsForPost = function (postId, options = {}) {
  const {
    sortBy = "upvotes",
    sortOrder = "desc",
    limit = 50,
    skip = 0,
    maxDepth = 10,
  } = options;

  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  return this.find({
    postId,
    isActive: true,
    depth: { $lte: maxDepth },
  })
    .populate("userId", "name avatar")
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
