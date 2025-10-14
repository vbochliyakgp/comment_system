import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import Post from "../components/Post";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import Layout from "../components/Layout";

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const {
    currentPost,
    comments,
    commentsLoading,
    commentsError,
    upvotedComments,
    fetchPostWithComments,
    upvoteComment,
    upvotePost,
  } = useData();

  const [showCommentCreationForm, setShowCommentCreationForm] = useState(false);

  // Load post and comments when component mounts
  useEffect(() => {
    if (postId) {
      fetchPostWithComments(postId);
    }
  }, [postId, fetchPostWithComments]);

  const handleBackToList = () => {
    navigate("/");
  };

  const handleUpvote = async (commentId: string) => {
    try {
      await upvoteComment(commentId);
    } catch (error) {
      console.error("PostDetailPage: Failed to upvote comment:", error);
      alert("Failed to upvote comment: " + (error as Error).message);
    }
  };

  const handlePostUpvote = async () => {
    if (currentPost) {
      try {
        await upvotePost(currentPost._id);
      } catch (error) {
        console.error("PostDetailPage: Failed to upvote post:", error);
        alert("Failed to upvote post: " + (error as Error).message);
      }
    }
  };

  const handleReply = (_commentId: string) => {
    // This is handled by the Comment component now
  };

  if (!postId) {
    return (
      <Layout>
        <div className="error-message">
          <h2>Post not found</h2>
          <button onClick={handleBackToList} className="back-button">
            <ArrowLeft size={16} />
            Back to Posts
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <button className="back-button" onClick={handleBackToList}>
        <ArrowLeft size={16} />
        Back to Posts
      </button>

      {currentPost && (
        <Post
          post={currentPost}
          onUpvote={handlePostUpvote}
          setShowCommentCreationForm={setShowCommentCreationForm}
        />
      )}

      {currentPost && showCommentCreationForm && (
        <CommentForm
          postId={currentPost._id}
          onSuccess={() => {
            // Comments will be refreshed automatically by the createComment function
          }}
          setShowCommentCreationForm={setShowCommentCreationForm}
        />
      )}

      {commentsError && <div className="error-message">{commentsError}</div>}

      {commentsLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading comments...</p>
        </div>
      ) : (
        <CommentList
          comments={comments}
          onUpvote={handleUpvote}
          onReply={handleReply}
          upvotedComments={upvotedComments}
          postId={postId}
        />
      )}
    </Layout>
  );
};

export default PostDetailPage;
