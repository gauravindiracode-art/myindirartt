import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToPost } from '../api/postApi';
import type { Post } from '../api/types';
import PostDetail from '../components/posts/PostDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    return subscribeToPost(id, (p) => {
      setPost(p);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!post) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-slate-500">Post not found</p>
        <button
          onClick={() => navigate('/posts')}
          className="mt-3 text-sm text-primary font-medium"
        >
          Back to posts
        </button>
      </div>
    );
  }

  return <PostDetail post={post} onBack={() => navigate(-1)} />;
}
