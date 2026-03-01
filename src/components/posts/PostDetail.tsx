import { ArrowLeft, MessageSquare, Megaphone, Newspaper } from 'lucide-react';
import type { Post } from '../../api/types';
import EmojiReactions from './EmojiReactions';

const TYPE_CONFIG = {
  leadership: { icon: MessageSquare, label: 'Leadership', color: 'bg-primary-50 text-primary' },
  announcement: { icon: Megaphone, label: 'Announcement', color: 'bg-gold-50 text-amber-700' },
  news: { icon: Newspaper, label: 'News', color: 'bg-teal-50 text-teal' },
};

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

export default function PostDetail({ post, onBack }: PostDetailProps) {
  const config = TYPE_CONFIG[post.type];
  const Icon = config.icon;

  return (
    <div className="px-4 py-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-primary font-medium mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to posts
      </button>

      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
        {/* Type badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.color}`}>
          <Icon className="w-3 h-3" />
          {config.label}
        </span>

        {/* Author */}
        <div className="flex items-center gap-3 mt-3 mb-4">
          <img
            src={post.authorPhoto || `https://ui-avatars.com/api/?name=${post.authorName}&background=34A0A4&color=fff&size=40`}
            alt={post.authorName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">{post.authorName}</p>
            <p className="text-xs text-slate-400">{post.createdAt.toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-slate-900 mb-3">{post.title}</h2>
        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Emoji Reactions */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <EmojiReactions postId={post.id} />
        </div>
      </div>
    </div>
  );
}
