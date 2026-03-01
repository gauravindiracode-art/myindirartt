import { useEffect, useState } from 'react';
import { subscribeToAcknowledgmentPosts } from '../../api/acknowledgmentApi';
import { useAuth } from '../../contexts/AuthContext';
import type { AcknowledgmentPost } from '../../api/types';
import AcknowledgmentDetail from './AcknowledgmentDetail';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const AUDIENCE_LABELS: Record<string, string> = {
  student: 'Students',
  employee: 'Employees',
  both: 'Everyone',
};

export default function AcknowledgmentList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<AcknowledgmentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<AcknowledgmentPost | null>(null);

  useEffect(() => {
    const unsub = subscribeToAcknowledgmentPosts((data) => {
      setPosts(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = posts.filter((p) => {
    if (!user) return false;
    if (p.targetAudience === 'both') return true;
    return p.targetAudience === user.role;
  });

  if (selectedPost) {
    return <AcknowledgmentDetail post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div>
      <div className="px-4 md:px-6 py-3 md:pt-6">
        <h2 className="text-lg md:text-xl font-bold text-slate-800">Acknowledgments</h2>
        <p className="text-xs md:text-sm text-slate-400 mt-0.5">Read and acknowledge important notices</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState title="No acknowledgments" message="Nothing to acknowledge right now." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 md:px-6 pb-4">
          {filtered.map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm text-left hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{post.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {post.authorName} &middot; {post.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-medium shrink-0">
                  {AUDIENCE_LABELS[post.targetAudience]}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
