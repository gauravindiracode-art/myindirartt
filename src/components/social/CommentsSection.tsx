import { useEffect, useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToComments, addComment, deleteComment } from '../../api/socialApi';
import type { SocialComment } from '../../api/types';

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    return subscribeToComments(postId, setComments);
  }, [postId]);

  const handleSubmit = async () => {
    if (!user || !text.trim()) return;
    setSending(true);
    await addComment(postId, {
      content: text.trim(),
      authorUid: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL || '',
    });
    setText('');
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-neu-dark/20 space-y-3">
      {/* Comment list */}
      {comments.length > 0 && (
        <div className="space-y-2.5">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} postId={postId} />
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2">
        <img
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=34A0A4&color=fff&size=28`}
          alt={user?.displayName}
          className="w-7 h-7 rounded-full shrink-0"
        />
        <div className="flex-1 flex items-center gap-1.5 bg-neu rounded-xl px-3 py-1.5 neu-inset-sm">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <button
            onClick={handleSubmit}
            disabled={sending || !text.trim()}
            className="p-1 text-primary disabled:text-slate-300 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment, postId }: { comment: SocialComment; postId: string }) {
  const { user } = useAuth();
  const canDelete = user?.uid === comment.authorUid || user?.role === 'admin';

  const timeAgo = formatTimeAgo(comment.createdAt);

  return (
    <div className="flex items-start gap-2 group">
      <img
        src={comment.authorPhoto || `https://ui-avatars.com/api/?name=${comment.authorName}&background=34A0A4&color=fff&size=24`}
        alt={comment.authorName}
        className="w-6 h-6 rounded-full mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-neu rounded-xl px-3 py-2 inline-block max-w-full neu-inset-sm">
          <p className="text-xs font-semibold text-slate-800">{comment.authorName}</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{comment.content}</p>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5 px-1">{timeAgo}</p>
      </div>
      {canDelete && (
        <button
          onClick={() => deleteComment(postId, comment.id)}
          className="p-1 rounded-lg text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all mt-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
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
