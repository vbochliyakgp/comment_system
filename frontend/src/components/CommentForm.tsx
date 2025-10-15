import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import "./CommentForm.css";

interface CommentFormProps {
  postId: string;
  onSuccess?: () => void;
  placeholder?: string;
  setShowCommentCreationForm: (show: boolean) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onSuccess,
  setShowCommentCreationForm,
  placeholder = "Share your thoughts...",
}) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { createComment } = useData();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter a comment");
      return;
    }

    if (text.length > 2000) {
      setError("Comment cannot exceed 2000 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await createComment(text.trim(), postId);
      setShowCommentCreationForm(false);
      setText("");
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setText("");
    setError("");
  };

  return (
    <motion.div
      className="comment-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="comment-form-header">
        <div className="comment-form-title">
          <MessageCircle size={20} />
          <span>Add a Comment</span>
        </div>
        <div className="comment-author">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="comment-author-avatar"
          />
          <span className="comment-author-name">{user?.name}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="comment-form-content">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="comment-textarea"
          rows={4}
          maxLength={2000}
          disabled={isSubmitting}
        />

        <div className="comment-form-footer">
          <div className="comment-form-info">
            <span className="character-count">{text.length}/2000</span>
            {error && (
              <motion.span
                className="comment-error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {error}
              </motion.span>
            )}
          </div>

          <div className="comment-form-actions">
            {text.trim() && (
              <motion.button
                type="button"
                className="comment-cancel-btn"
                onClick={handleCancel}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear
              </motion.button>
            )}

            <motion.button
              type="button"
              className="comment-cancel-btn"
              onClick={() => setShowCommentCreationForm(false)}
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              className="comment-submit-btn"
              disabled={isSubmitting || !text.trim()}
              whileHover={{ scale: isSubmitting || !text.trim() ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting || !text.trim() ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner-small" />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Post Comment
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CommentForm;
