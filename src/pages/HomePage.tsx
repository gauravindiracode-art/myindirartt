import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToPosts } from '../api/postApi';
import { useAuth } from '../contexts/AuthContext';
import type { Post } from '../api/types';
import PostCard from '../components/posts/PostCard';
import { MessageSquare, FileText, GraduationCap, Users2, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    return subscribeToPosts((posts) => {
      setRecentPosts(posts.slice(0, 3));
    });
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="px-4 md:px-6 py-4 md:py-6 space-y-5 md:space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-primary-700 rounded-2xl p-5 md:p-8 text-white">
        <p className="text-sm md:text-base text-primary-200">{greeting()}</p>
        <h2 className="text-xl md:text-2xl font-bold mt-0.5">{user?.displayName}</h2>
        <div className="mt-2 inline-block px-2.5 py-0.5 bg-white/15 rounded-full text-xs font-medium capitalize">
          {user?.role}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <QuickLink
          icon={<MessageSquare className="w-5 h-5" />}
          label="Posts"
          color="bg-primary-50 text-primary"
          onClick={() => navigate('/posts')}
        />
        <QuickLink
          icon={<Users2 className="w-5 h-5" />}
          label="Social"
          color="bg-purple-50 text-purple-700"
          onClick={() => navigate('/social')}
        />
        <QuickLink
          icon={<FileText className="w-5 h-5" />}
          label="Policies"
          color="bg-teal-50 text-teal"
          onClick={() => navigate('/policies')}
        />
        {user?.role === 'student' && (
          <QuickLink
            icon={<GraduationCap className="w-5 h-5" />}
            label="Academics"
            color="bg-gold-50 text-amber-700"
            onClick={() => navigate('/academics')}
          />
        )}
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm md:text-base font-semibold text-slate-700">Recent Posts</h3>
            <button
              onClick={() => navigate('/posts')}
              className="flex items-center gap-0.5 text-xs text-primary font-medium"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} onClick={() => navigate(`/posts/${post.id}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickLink({
  icon,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-4 rounded-xl ${color} hover:opacity-80 transition-opacity`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
