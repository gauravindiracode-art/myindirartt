import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToSocialFeed, subscribeToAllSocialPosts } from '../../api/socialApi';
import type { SocialPost } from '../../api/types';
import SocialCard from './SocialCard';
import SocialPostForm from './SocialPostForm';

export default function SocialFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<SocialPost | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const sub = isAdmin
      ? subscribeToAllSocialPosts(setPosts)
      : subscribeToSocialFeed(setPosts);
    return sub;
  }, [isAdmin]);

  const handleEdit = (post: SocialPost) => {
    setEditPost(post);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditPost(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Create button */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-4 shadow-sm text-sm text-slate-400 hover:border-primary-300 transition-colors"
      >
        <img
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=34A0A4&color=fff&size=40`}
          alt={user?.displayName}
          className="w-10 h-10 rounded-full"
        />
        <span className="flex-1 text-left">What's on your mind?</span>
        <Plus className="w-5 h-5" />
      </button>

      {/* Feed */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No posts yet. Be the first to share something!
        </div>
      ) : (
        posts.map((post) => (
          <SocialCard key={post.id} post={post} onEdit={handleEdit} />
        ))
      )}

      {/* Form modal */}
      {showForm && (
        <SocialPostForm post={editPost} onClose={handleCloseForm} />
      )}
    </div>
  );
}
