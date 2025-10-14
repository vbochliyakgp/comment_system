import { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import PostList from '../components/PostList';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const PostListPage: React.FC = () => {
  const { 
    posts,
    postsLoading,
    upvotedPosts,
    fetchPosts,
    upvotePost
  } = useData();
  const navigate = useNavigate();

  // Load posts when component mounts
  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [posts.length, fetchPosts]);

  const handlePostClick = (post: { _id: string }) => {
    navigate(`/posts/${post._id}`);
  };

  const handleUpvote = async (postId: string) => {
    try {
      await upvotePost(postId);
    } catch (error) {
      console.error('PostListPage: Failed to upvote post:', error);
      alert('Failed to upvote post: ' + (error as Error).message);
    }
  };

  return (
    <Layout>
      {postsLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : (
        <PostList 
          posts={posts}
          onPostClick={handlePostClick}
          onUpvote={handleUpvote}
          upvotedPosts={upvotedPosts}
        />
      )}
    </Layout>
  );
};

export default PostListPage;
