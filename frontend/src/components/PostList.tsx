import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import type { Post } from '../services/api';
import './PostList.css';

interface PostListProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onUpvote: (postId: string) => void;
}

export default function PostList({ posts, onPostClick, onUpvote }: PostListProps) {
  return (
    <div className="post-list">
      <h2>All Posts</h2>
      <div className="posts-grid">
        {posts.map((post) => (
          <motion.div
            key={post._id}
            className="post-card"
            onClick={() => onPostClick(post)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="post-header">
              <h3 className="post-title">{post.title}</h3>
              <span className="post-author">by {post.author}</span>
            </div>
            
            <div className="post-content">
              <p>{post.content}</p>
            </div>
            
            <div className="post-stats">
              <div className="post-stat">
                <MessageCircle size={16} />
                <span>{post.commentCount || 0} comments</span>
              </div>
              <div className="post-stat">
                <ThumbsUp 
                  size={16} 
                  className={post.hasUpvoted === true ? 'upvoted' : ''}
                />
                <span>{post.upvotes || 0} upvotes</span>
              </div>
            </div>
            
            <div className="post-actions">
              <button
                className={`upvote-btn ${post.hasUpvoted === true ? 'upvoted' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpvote(post._id);
                }}
              >
                <ThumbsUp size={16} />
                {post.hasUpvoted === true ? 'Upvoted' : 'Upvote'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
