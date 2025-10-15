import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, SortAsc, SortDesc, MoreHorizontal } from 'lucide-react';
import Comment from './Comment';
import type { Comment as CommentType } from '../services/api';
import './CommentList.css';

interface CommentListProps {
  comments: CommentType[];
  onUpvote: (commentId: string) => void;
  onReply: (commentId: string) => void;
  upvotedComments?: Set<string>;
  postId: string;
}

type SortOption = 'newest' | 'oldest' | 'most_upvoted' | 'least_upvoted';

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onUpvote, 
  onReply,
  upvotedComments = new Set(),
  postId
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('most_upvoted');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most_upvoted':
        return b.upvotes - a.upvotes;
      case 'least_upvoted':
        return a.upvotes - b.upvotes;
      default:
        return 0;
    }
  });

  const sortOptions = [
    { value: 'most_upvoted', label: 'Most Upvoted', icon: SortDesc },
    { value: 'least_upvoted', label: 'Least Upvoted', icon: SortAsc },
    { value: 'newest', label: 'Newest First', icon: SortDesc },
    { value: 'oldest', label: 'Oldest First', icon: SortAsc }
  ];

  const getSortLabel = (option: SortOption) => {
    return sortOptions.find(opt => opt.value === option)?.label || 'Sort';
  };

  const totalComments = comments.length;
  const topLevelLimit = 10;
  const hasMoreComments = totalComments > topLevelLimit;
  const visibleComments = showAllComments 
    ? sortedComments 
    : sortedComments.slice(0, topLevelLimit);

  return (
    <div className="comment-list">
      <div className="comment-list-header">
        <div className="comment-count">
          <MessageCircle size={20} />
          <span>{totalComments} {totalComments === 1 ? 'Comment' : 'Comments'}</span>
        </div>
        
        <div className="sort-container">
          <button 
            className="sort-button"
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            <span>{getSortLabel(sortBy)}</span>
            <SortDesc size={16} />
          </button>
          
          {showSortOptions && (
            <motion.div 
              className="sort-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy(option.value as SortOption);
                      setShowSortOptions(false);
                    }}
                  >
                    <Icon size={16} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      <div className="comments-container">
        {sortedComments.length === 0 ? (
          <div className="no-comments">
            <MessageCircle size={48} />
            <h3>No comments yet</h3>
            <p>Be the first to share your thoughts!</p>
          </div>
        ) : (
          <motion.div 
            className="comments"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {visibleComments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onUpvote={onUpvote}
                onReply={onReply}
                depth={0}
                upvotedComments={upvotedComments}
                postId={postId}
              />
            ))}
            
            {hasMoreComments && (
              <motion.button
                className="see-more-button"
                onClick={() => setShowAllComments(!showAllComments)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <MoreHorizontal size={16} />
                <span>
                  {showAllComments 
                    ? 'Show less' 
                    : `View ${totalComments - topLevelLimit} more ${totalComments - topLevelLimit === 1 ? 'comment' : 'comments'}`
                  }
                </span>
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
