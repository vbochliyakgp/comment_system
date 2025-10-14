import { motion } from "framer-motion";
import { ThumbsUp, MessageCircle, Calendar } from "lucide-react";
import type { Post as PostType } from "../services/api";
import "./Post.css";

interface PostProps {
  post: PostType;
  onUpvote?: () => void;
  setShowCommentCreationForm: (show: boolean) => void;
}

const Post: React.FC<PostProps> = ({
  post,
  onUpvote,
  setShowCommentCreationForm,
}) => {
  const actualIsUpvoted = post.hasUpvoted === true;
  console.log('Post component - post.hasUpvoted:', post.hasUpvoted, 'actualIsUpvoted:', actualIsUpvoted, 'upvotes:', post.upvotes);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.article
      className="post"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span className="post-author">by {post.author}</span>
          <div className="post-date">
            <Calendar size={16} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="post-content">
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index} className="post-paragraph">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="post-actions">
        <motion.button
          className={`action-button upvote-button ${
            actualIsUpvoted ? "upvoted" : ""
          }`}
          onClick={onUpvote}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsUp size={18} />
          <span>{post.upvotes}</span>
        </motion.button>

        <motion.button
          className="action-button comment-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCommentCreationForm(true)}
        >
          <MessageCircle size={18} />
          <span> Add a Comment</span>
        </motion.button>
      </div>
    </motion.article>
  );
};

export default Post;
