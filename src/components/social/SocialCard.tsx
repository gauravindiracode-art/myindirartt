import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, ShieldOff, ShieldAlert, Flag, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { deleteSocialPost, toggleBlockSocialPost } from '../../api/socialApi';
import { subscribeToSocialReactions, setSocialReaction } from '../../api/socialApi';
import type { SocialPost } from '../../api/types';
import EmojiReactions from '../posts/EmojiReactions';
import ReportModal from './ReportModal';
import CommentsSection from './CommentsSection';

interface SocialCardProps {
  post: SocialPost;
  onEdit: (post: SocialPost) => void;
}

export default function SocialCard({ post, onEdit }: SocialCardProps) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isOwner = user?.uid === post.authorUid;
  const isAdmin = user?.role === 'admin';

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    await deleteSocialPost(post.id);
  };

  const handleBlock = async () => {
    await toggleBlockSocialPost(post.id, !post.blocked);
  };

  const timeAgo = formatTimeAgo(post.createdAt);

  return (
    <article className="bg-neu rounded-2xl p-4 neu">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={post.authorPhoto || `https://ui-avatars.com/api/?name=${post.authorName}&background=34A0A4&color=fff&size=40`}
          alt={post.authorName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{post.authorName}</p>
          <p className="text-xs text-slate-400">
            {timeAgo}
            {post.updatedAt && ' (edited)'}
          </p>
        </div>

        {post.blocked && isAdmin && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600">
            <ShieldOff className="w-3 h-3" />
            Blocked
          </span>
        )}

        {/* Actions menu */}
        {(isOwner || isAdmin) && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:neu-inset-sm text-slate-400 transition-all"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-neu rounded-xl py-1 min-w-[140px] neu">
                  {isOwner && (
                    <button
                      onClick={() => { setMenuOpen(false); onEdit(post); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-neu-dark/10"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => { setMenuOpen(false); handleBlock(); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-neu-dark/10"
                    >
                      {post.blocked ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                      {post.blocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                  {(isOwner || isAdmin) && (
                    <button
                      onClick={() => { setMenuOpen(false); handleDelete(); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-slate-700 whitespace-pre-wrap mb-3">{post.content}</p>

      {/* Footer: Reactions + Comments toggle + Report */}
      <div className="mt-3 pt-3 border-t border-neu-dark/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EmojiReactions
            postId={post.id}
            subscribeFn={subscribeToSocialReactions}
            reactFn={setSocialReaction}
          />
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
              showComments
                ? 'bg-primary-50 text-primary neu-inset-sm'
                : 'bg-neu text-slate-600 neu-sm hover:neu-inset-sm'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Comment
          </button>
        </div>
        {user && !isOwner && (
          <button
            onClick={() => setShowReport(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            Report
          </button>
        )}
      </div>

      {/* Comments */}
      {showComments && <CommentsSection postId={post.id} />}

      {showReport && (
        <ReportModal
          postId={post.id}
          onClose={() => setShowReport(false)}
        />
      )}
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
