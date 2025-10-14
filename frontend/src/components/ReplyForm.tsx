import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import './ReplyForm.css';

interface ReplyFormProps {
  parentId: string;
  postId: string;
  onCancel: () => void;
  onSuccess?: () => void;
  placeholder?: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ 
  parentId, 
  postId, 
  onCancel, 
  onSuccess,
  placeholder = "Write your reply..."
}) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { createComment } = useData();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter a reply');
      return;
    }

    if (text.length > 2000) {
      setError('Reply cannot exceed 2000 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createComment(text.trim(), postId, parentId);
      setText('');
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setText('');
    setError('');
    onCancel();
  };

  return (
    <motion.div 
      className="reply-form"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="reply-form-header">
        <div className="reply-author">
          <img 
            src={user?.avatar} 
            alt={user?.name}
            className="reply-author-avatar"
          />
          <span className="reply-author-name">Replying as {user?.name}</span>
        </div>
        <button 
          className="reply-cancel-button"
          onClick={handleCancel}
          type="button"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="reply-form-content">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="reply-textarea"
          rows={3}
          maxLength={2000}
          disabled={isSubmitting}
        />
        
        <div className="reply-form-footer">
          <div className="reply-form-info">
            <span className="character-count">
              {text.length}/2000
            </span>
            {error && (
              <motion.span 
                className="reply-error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {error}
              </motion.span>
            )}
          </div>
          
          <div className="reply-form-actions">
            <motion.button
              type="button"
              className="reply-cancel-btn"
              onClick={handleCancel}
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              className="reply-submit-btn"
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
                  Reply
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ReplyForm;
