import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, Reply, ChevronDown, ChevronRight } from 'lucide-react';
import type { Comment as CommentType } from '../services/api';
import ReplyForm from './ReplyForm';
import './Comment.css';

interface CommentProps {
  comment: CommentType & { replies?: CommentType[] };
  onUpvote: (commentId: string) => void;
  onReply: (commentId: string) => void;
  depth?: number;
  upvotedComments?: Set<string>;
  postId: string;
}

const Comment: React.FC<CommentProps> = ({ 
  comment, 
  onUpvote, 
  onReply, 
  depth = 0,
  upvotedComments = new Set(),
  postId
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const isUpvoted = useMemo(() => {
    return comment.hasUpvoted === true || upvotedComments.has(comment._id);
  }, [comment.hasUpvoted, comment._id, upvotedComments]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleUpvote = () => {
    onUpvote(comment._id);
  };

  const handleReply = () => {
    setShowReplyForm(true);
    onReply(comment._id);
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };

  const handleReplyCancel = () => {
    setShowReplyForm(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const maxDepth = 6;
  const shouldShowCollapse = depth >= maxDepth && comment.replies && comment.replies.length > 0;

  return (
    <motion.div 
      className={`comment ${depth > 0 ? 'nested' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.05 }}
    >
      <div className="comment-content">
        <div className="comment-header">
          <div className="comment-author">
            <img 
              src={comment.userId.avatar} 
              alt={comment.userId.name}
              className="author-avatar"
            />
            <div className="author-info">
              <span className="author-name">{comment.userId.name}</span>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>
          </div>
          
          {shouldShowCollapse && (
            <button 
              className="expand-button"
              onClick={toggleExpanded}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            </button>
          )}
        </div>

        <div className="comment-text">
          {comment.text}
        </div>

        <div className="comment-actions">
          <motion.button 
            className={`action-button upvote-button ${isUpvoted ? 'upvoted' : ''}`}
            onClick={handleUpvote}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThumbsUp size={16} />
            <span>{comment.upvotes}</span>
          </motion.button>

          <motion.button 
            className="action-button reply-button"
            onClick={handleReply}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Reply size={16} />
            <span>Reply</span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showReplyForm && (
          <ReplyForm
            parentId={comment._id}
            postId={postId}
            onCancel={handleReplyCancel}
            onSuccess={handleReplySuccess}
            placeholder={`Reply to ${comment.userId.name}...`}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && comment.replies && comment.replies.length > 0 && (
          <motion.div 
            className="comment-replies"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {comment.replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                onUpvote={onUpvote}
                onReply={onReply}
                depth={depth + 1}
                upvotedComments={upvotedComments}
                postId={postId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Comment;
