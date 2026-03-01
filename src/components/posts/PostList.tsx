import { useEffect, useState } from 'react';
import { subscribeToPosts } from '../../api/postApi';
import type { Post, PostType } from '../../api/types';
import PostCard from './PostCard';
import PostDetail from './PostDetail';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const TABS: { label: string; value: PostType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Leadership', value: 'leadership' },
  { label: 'Announcements', value: 'announcement' },
  { label: 'News', value: 'news' },
];

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PostType | 'all'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    setLoading(true);
    const filterType = activeTab === 'all' ? undefined : activeTab;
    const unsub = subscribeToPosts((data) => {
      setPosts(data);
      setLoading(false);
    }, filterType);
    return unsub;
  }, [activeTab]);

  if (selectedPost) {
    return <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
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
        <div className="flex flex-col gap-3 px-4 pb-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
          ))}
        </div>
      )}
    </div>
  );
}
