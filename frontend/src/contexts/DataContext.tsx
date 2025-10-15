import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { postsAPI, commentsAPI } from "../services/api";
import type { Post, Comment } from "../services/api";
import { useAuth } from "./AuthContext";

interface DataContextType {
  // Posts
  posts: Post[];
  currentPost: Post | null;
  postsLoading: boolean;
  postsError: string | null;
  upvotedPosts: Set<string>;

  // Comments
  comments: Comment[];
  commentsLoading: boolean;
  commentsError: string | null;
  upvotedComments: Set<string>;

  // Actions
  fetchPosts: () => Promise<void>;
  fetchPostWithComments: (
    id: string,
    sortBy?: string,
    sortOrder?: string
  ) => Promise<void>;
  createComment: (
    text: string,
    postId: string,
    parentId?: string
  ) => Promise<void>;
  upvoteComment: (commentId: string) => Promise<void>;
  upvotePost: (postId: string) => Promise<void>;
  refreshComments: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [upvotedPosts, setUpvotedPosts] = useState<Set<string>>(new Set());

  const [comments, setComments] = useState<Comment[]>([]);
  const [upvotedComments, setUpvotedComments] = useState<Set<string>>(
    new Set()
  );
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      setPostsError(null);
      const response = await postsAPI.getPosts({
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response.success && response.data) {
        setPosts(response.data.posts);

        const upvotedPostIds = response.data.posts
          .filter((post: any) => post.hasUpvoted)
          .map((post: any) => post._id);
        setUpvotedPosts(new Set(upvotedPostIds));
      } else {
        throw new Error(response.message || "Failed to fetch posts");
      }
    } catch (error: any) {
      console.error("Fetch posts error:", error);
      setPostsError(error.message || "Failed to fetch posts");
    } finally {
      setPostsLoading(false);
    }
  }, []);

  const fetchPostWithComments = useCallback(
    async (id: string, sortBy = "upvotes", sortOrder = "desc") => {
      try {
        setCommentsLoading(true);
        setCommentsError(null);
        const response = await postsAPI.getPostWithComments(id, {
          sortBy,
          sortOrder,
          limit: 50,
        });

        if (response.success && response.data) {
          setCurrentPost(response.data.post);
          setComments(response.data.comments);

          const upvotedCommentIds = response.data.comments
            .filter((comment: any) => comment.hasUpvoted)
            .map((comment: any) => comment._id);
          setUpvotedComments(new Set(upvotedCommentIds));
        } else {
          throw new Error(
            response.message || "Failed to fetch post with comments"
          );
        }
      } catch (error: any) {
        console.error("Fetch post with comments error:", error);
        setCommentsError(error.message || "Failed to fetch post with comments");
      } finally {
        setCommentsLoading(false);
      }
    },
    []
  );

  const createComment = useCallback(
    async (text: string, postId: string, parentId?: string) => {
      try {
        const response = await commentsAPI.createComment({
          text,
          postId,
          parentId,
        });

        if (response.success && response.data?.comment) {
          setComments((prevComments) => {
            const newComment = response.data!.comment;
            return [...prevComments, newComment];
          });
        } else {
          throw new Error(response.message || "Failed to create comment");
        }
      } catch (error: any) {
        console.error("Create comment error:", error);
        throw new Error(error.message || "Failed to create comment");
      }
    },
    []
  );

  const upvoteComment = useCallback(async (commentId: string) => {
    try {
      const response = await commentsAPI.upvoteComment(commentId);

      if (response.success && response.data) {
        setComments((prevComments) => {
          const updatedComments = prevComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  upvotes:
                    response.data?.upvotes == 0
                      ? 0
                      : response.data?.upvotes || comment.upvotes,
                  hasUpvoted: response.data?.hasUpvoted || false,
                }
              : comment
          );
          return [...updatedComments];
        });

        setUpvotedComments((prev) => {
          const newSet = new Set(prev);
          if (response.data?.hasUpvoted) {
            newSet.add(commentId);
          } else {
            newSet.delete(commentId);
          }
          return newSet;
        });
      } else {
        throw new Error(response.message || "Failed to upvote comment");
      }
    } catch (error: any) {
      console.error("Upvote comment error:", error);
      throw new Error(error.message || "Failed to upvote comment");
    }
  }, []);

  const upvotePost = useCallback(
    async (postId: string) => {
      try {
        const response = await postsAPI.upvotePost(postId);

        if (response.success && response.data) {
          if (currentPost && currentPost._id === postId) {
            setCurrentPost((prev) =>
              prev
                ? {
                    ...prev,
                    upvotes: response.data?.upvotes || prev.upvotes,
                    hasUpvoted: response.data?.hasUpvoted || false,
                  }
                : null
            );
          }

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    upvotes: response.data?.upvotes || post.upvotes,
                    hasUpvoted: response.data?.hasUpvoted || false,
                  }
                : post
            )
          );

          setUpvotedPosts((prev) => {
            const newSet = new Set(prev);
            if (response.data?.hasUpvoted) {
              newSet.add(postId);
            } else {
              newSet.delete(postId);
            }
            return newSet;
          });
        } else {
          throw new Error(response.message || "Failed to upvote post");
        }
      } catch (error: any) {
        console.error("Upvote post error:", error);
        throw new Error(error.message || "Failed to upvote post");
      }
    },
    [currentPost]
  );

  const refreshComments = useCallback(async () => {
    if (currentPost) {
      await fetchPostWithComments(currentPost._id);
    }
  }, [currentPost, fetchPostWithComments]);

  const buildNestedComments = (
    comments: Comment[],
    currentUserId?: string
  ): Comment[] => {
    const commentMap = new Map<string, Comment & { replies?: Comment[] }>();
    const rootComments: (Comment & { replies?: Comment[] })[] = [];

    // Create map of all comments with empty replies array
    comments.forEach((comment) => {
      commentMap.set(comment._id, {
        ...comment,
        replies: [],
        userId: { ...comment.userId },
      });
    });

    // Build parent-child relationships
    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment._id);
      if (!commentWithReplies) return;

      if (!comment.parentId) {
        rootComments.push(commentWithReplies);
      } else {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      }
    });

    // Sort: user's comments first, then by upvotes
    const sortComments = (
      commentList: (Comment & { replies?: Comment[] })[]
    ) => {
      return commentList.sort((a, b) => {
        if (currentUserId) {
          const aIsUserComment = a.userId._id === currentUserId;
          const bIsUserComment = b.userId._id === currentUserId;

          if (aIsUserComment && !bIsUserComment) return -1;
          if (!aIsUserComment && bIsUserComment) return 1;
        }

        return b.upvotes - a.upvotes;
      });
    };

    const sortedRootComments = sortComments(rootComments);

    // Recursively sort all nested replies
    const sortRepliesRecursively = (
      commentList: (Comment & { replies?: Comment[] })[]
    ) => {
      commentList.forEach((comment) => {
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = sortComments(comment.replies);
          sortRepliesRecursively(comment.replies);
        }
      });
    };

    sortRepliesRecursively(sortedRootComments);
    console.debug("Sorted root comments:", sortedRootComments);
    return sortedRootComments;
  };

  const nestedComments = useMemo(() => {
    return buildNestedComments(comments, user?._id);
  }, [comments, user?._id, upvotedComments]);

  const value: DataContextType = {
    posts,
    currentPost,
    postsLoading,
    postsError,
    upvotedPosts,

    comments: nestedComments,
    commentsLoading,
    commentsError,
    upvotedComments,

    fetchPosts,
    fetchPostWithComments,
    createComment,
    upvoteComment,
    upvotePost,
    refreshComments,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
