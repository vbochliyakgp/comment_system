import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { postsAPI, commentsAPI } from '../services/api';
import type { Post, Comment } from '../services/api';
import { useAuth } from './AuthContext';

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
  fetchPost: (id: string) => Promise<void>;
  fetchPostWithComments: (id: string, sortBy?: string, sortOrder?: string) => Promise<void>;
  createComment: (text: string, postId: string, parentId?: string) => Promise<void>;
  editComment: (commentId: string, text: string) => Promise<void>;
  upvoteComment: (commentId: string) => Promise<void>;
  upvotePost: (postId: string) => Promise<void>;
  refreshComments: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [upvotedPosts, setUpvotedPosts] = useState<Set<string>>(new Set());

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [upvotedComments, setUpvotedComments] = useState<Set<string>>(new Set());
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  // Fetch all posts
  const fetchPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      setPostsError(null);
      const response = await postsAPI.getPosts({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });
      
      if (response.success && response.data) {
        setPosts(response.data.posts);
        
        // Initialize upvoted posts set
        const upvotedPostIds = response.data.posts
          .filter((post: any) => post.hasUpvoted)
          .map((post: any) => post._id);
        setUpvotedPosts(new Set(upvotedPostIds));
      } else {
        throw new Error(response.message || 'Failed to fetch posts');
      }
    } catch (error: any) {
      console.error('Fetch posts error:', error);
      setPostsError(error.message || 'Failed to fetch posts');
    } finally {
      setPostsLoading(false);
    }
  }, []);

  // Fetch single post
  const fetchPost = useCallback(async (id: string) => {
    try {
      setPostsLoading(true);
      setPostsError(null);
      const response = await postsAPI.getPost(id);
      
      if (response.success && response.data) {
        setCurrentPost(response.data.post);
      } else {
        throw new Error(response.message || 'Failed to fetch post');
      }
    } catch (error: any) {
      console.error('Fetch post error:', error);
      setPostsError(error.message || 'Failed to fetch post');
    } finally {
      setPostsLoading(false);
    }
  }, []);

  // Fetch post with comments
  const fetchPostWithComments = useCallback(async (id: string, sortBy = 'upvotes', sortOrder = 'desc') => {
    try {
      setCommentsLoading(true);
      setCommentsError(null);
      const response = await postsAPI.getPostWithComments(id, { sortBy, sortOrder, limit: 50 });
      
      if (response.success && response.data) {
        setCurrentPost(response.data.post);
        setComments(response.data.comments);
        
        // Initialize upvoted comments set
        const upvotedCommentIds = response.data.comments
          .filter((comment: any) => comment.hasUpvoted)
          .map((comment: any) => comment._id);
        setUpvotedComments(new Set(upvotedCommentIds));
      } else {
        throw new Error(response.message || 'Failed to fetch post with comments');
      }
    } catch (error: any) {
      console.error('Fetch post with comments error:', error);
      setCommentsError(error.message || 'Failed to fetch post with comments');
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  // Create comment
  const createComment = useCallback(async (text: string, postId: string, parentId?: string) => {
    try {
      const response = await commentsAPI.createComment({ text, postId, parentId });
      
      if (response.success) {
        // Refresh comments for the specific post
        await fetchPostWithComments(postId);
      } else {
        throw new Error(response.message || 'Failed to create comment');
      }
    } catch (error: any) {
      console.error('Create comment error:', error);
      throw new Error(error.message || 'Failed to create comment');
    }
  }, [fetchPostWithComments]);

  // Upvote comment
  const upvoteComment = useCallback(async (commentId: string) => {
    try {
      const response = await commentsAPI.upvoteComment(commentId);
      
      if (response.success && response.data) {
        // Update the comment in the local state with new upvote status
        setComments(prevComments => 
          prevComments.map(comment => 
            comment._id === commentId 
              ? { 
                  ...comment, 
                  upvotes: response.data?.upvotes || comment.upvotes,
                  downvotes: response.data?.downvotes || comment.downvotes,
                  hasUpvoted: response.data?.hasUpvoted || false,
                  hasDownvoted: false // Reset downvote when upvoting
                }
              : comment
          )
        );

        // Update upvoted comments set
        setUpvotedComments(prev => {
          const newSet = new Set(prev);
          if (response.data?.hasUpvoted) {
            newSet.add(commentId);
          } else {
            newSet.delete(commentId);
          }
          return newSet;
        });
      } else {
        throw new Error(response.message || 'Failed to upvote comment');
      }
    } catch (error: any) {
      console.error('Upvote comment error:', error);
      throw new Error(error.message || 'Failed to upvote comment');
    }
  }, []);

  // Upvote post
  const upvotePost = useCallback(async (postId: string) => {
    try {
      console.log('Upvoting post:', postId);
      const response = await postsAPI.upvotePost(postId);
      
      if (response.success && response.data) {
        // Update the post in the local state with new upvote status
        if (currentPost && currentPost._id === postId) {
          setCurrentPost(prev => prev ? { 
            ...prev, 
            upvotes: response.data?.upvotes || prev.upvotes,
            downvotes: response.data?.downvotes || prev.downvotes,
            hasUpvoted: response.data?.hasUpvoted || false,
            hasDownvoted: false // Reset downvote when upvoting
          } : null);
        }
        
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { 
                  ...post, 
                  upvotes: response.data?.upvotes || post.upvotes,
                  downvotes: response.data?.downvotes || post.downvotes,
                  hasUpvoted: response.data?.hasUpvoted || false,
                  hasDownvoted: false // Reset downvote when upvoting
                }
              : post
          )
        );

        // Update upvoted posts set
        setUpvotedPosts(prev => {
          const newSet = new Set(prev);
          if (response.data?.hasUpvoted) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });
      } else {
        throw new Error(response.message || 'Failed to upvote post');
      }
    } catch (error: any) {
      console.error('Upvote post error:', error);
      throw new Error(error.message || 'Failed to upvote post');
    }
  }, [currentPost]);

  // Edit comment
  const editComment = useCallback(async (commentId: string, text: string) => {
    try {
      const response = await commentsAPI.updateComment(commentId, { text });
      
      if (response.success) {
        // Update the comment in the local state
        setComments(prevComments => 
          prevComments.map(comment => 
            comment._id === commentId 
              ? { ...comment, text: text, updatedAt: new Date().toISOString() }
              : comment
          )
        );
      } else {
        throw new Error(response.message || 'Failed to update comment');
      }
    } catch (error: any) {
      console.error('Edit comment error:', error);
      throw new Error(error.message || 'Failed to update comment');
    }
  }, []);

  // Refresh comments
  const refreshComments = useCallback(async () => {
    if (currentPost) {
      await fetchPostWithComments(currentPost._id);
    }
  }, [currentPost, fetchPostWithComments]);

  // Build nested comment structure
  const buildNestedComments = (comments: Comment[], currentUserId?: string): Comment[] => {
    const commentMap = new Map<string, Comment & { replies?: Comment[] }>();
    const rootComments: (Comment & { replies?: Comment[] })[] = [];

    // First pass: create comment objects
    comments.forEach(comment => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    // Second pass: build the tree structure
    comments.forEach(comment => {
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

    // Sort function to prioritize user's own comments
    const sortComments = (commentList: (Comment & { replies?: Comment[] })[]) => {
      return commentList.sort((a, b) => {
        // If current user is provided, prioritize their comments
        if (currentUserId) {
          const aIsUserComment = a.userId._id === currentUserId;
          const bIsUserComment = b.userId._id === currentUserId;
          
          // User's comments come first
          if (aIsUserComment && !bIsUserComment) return -1;
          if (!aIsUserComment && bIsUserComment) return 1;
        }
        
        // Then sort by upvotes (descending)
        return b.upvotes - a.upvotes;
      });
    };

    // Sort root comments
    const sortedRootComments = sortComments(rootComments);

    // Sort replies recursively
    const sortRepliesRecursively = (commentList: (Comment & { replies?: Comment[] })[]) => {
      commentList.forEach(comment => {
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = sortComments(comment.replies);
          sortRepliesRecursively(comment.replies);
        }
      });
    };

    sortRepliesRecursively(sortedRootComments);

    return sortedRootComments;
  };

  const value: DataContextType = {
    // Posts
    posts,
    currentPost,
    postsLoading,
    postsError,
    upvotedPosts,
    
    // Comments
    comments: buildNestedComments(comments, user?._id),
    commentsLoading,
    commentsError,
    upvotedComments,
    
    // Actions
    fetchPosts,
    fetchPost,
    fetchPostWithComments,
    createComment,
    editComment,
    upvoteComment,
    upvotePost,
    refreshComments,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
