import { MessageSquare, Megaphone, Newspaper } from 'lucide-react';
import type { Post } from '../../api/types';
import EmojiReactions from './EmojiReactions';

const TYPE_CONFIG = {
  leadership: { icon: MessageSquare, label: 'Leadership', color: 'bg-primary-50 text-primary' },
  announcement: { icon: Megaphone, label: 'Announcement', color: 'bg-gold-50 text-amber-700' },
  news: { icon: Newspaper, label: 'News', color: 'bg-teal-50 text-teal' },
};

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const config = TYPE_CONFIG[post.type];
  const Icon = config.icon;

  const timeAgo = formatTimeAgo(post.createdAt);

  return (
    <article
      onClick={onClick}
      className={`bg-neu rounded-2xl p-4 neu${onClick ? ' cursor-pointer hover:neu-inset transition-all' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={post.authorPhoto || `https://ui-avatars.com/api/?name=${post.authorName}&background=34A0A4&color=fff&size=40`}
          alt={post.authorName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{post.authorName}</p>
          <p className="text-xs text-slate-400">{timeAgo}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.color}`}>
          <Icon className="w-3 h-3" />
          {config.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{post.title}</h3>

      {/* Reactions */}
      <div className="mt-3 pt-3 border-t border-neu-dark/20">
        <EmojiReactions postId={post.id} />
      </div>
    </article>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
