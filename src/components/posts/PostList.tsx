import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToPosts } from '../../api/postApi';
import type { Post, PostType } from '../../api/types';
import PostCard from './PostCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const TABS: { label: string; value: PostType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Leadership', value: 'leadership' },
  { label: 'Announcements', value: 'announcement' },
  { label: 'News', value: 'news' },
];

export default function PostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PostType | 'all'>('all');

  useEffect(() => {
    setLoading(true);
    const filterType = activeTab === 'all' ? undefined : activeTab;
    const unsub = subscribeToPosts((data) => {
      setPosts(data);
      setLoading(false);
    }, filterType);
    return unsub;
  }, [activeTab]);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 md:px-6 py-3 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <EmptyState title="No posts" message="No posts to display right now." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 md:px-6 pb-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onClick={() => navigate(`/posts/${post.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
