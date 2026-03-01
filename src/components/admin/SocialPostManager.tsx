import { useEffect, useState } from 'react';
import { ShieldOff, ShieldAlert, Trash2, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import {
  subscribeToAllSocialPosts,
  toggleBlockSocialPost,
  deleteSocialPost,
  deleteSocialMedia,
  subscribeToReports,
} from '../../api/socialApi';
import type { SocialPost, SocialReport } from '../../api/types';

export default function SocialPostManager() {
  const [posts, setPosts] = useState<SocialPost[]>([]);

  useEffect(() => {
    return subscribeToAllSocialPosts(setPosts);
  }, []);

  return (
    <div className="space-y-3">
      {posts.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No social posts yet.</p>
      ) : (
        posts.map((post) => (
          <SocialPostRow key={post.id} post={post} />
        ))
      )}
    </div>
  );
}

function SocialPostRow({ post }: { post: SocialPost }) {
  const [reports, setReports] = useState<SocialReport[]>([]);
  const [showReports, setShowReports] = useState(false);

  useEffect(() => {
    return subscribeToReports(post.id, setReports);
  }, [post.id]);

  const handleBlock = async () => {
    await toggleBlockSocialPost(post.id, !post.blocked);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    if (post.mediaURL) await deleteSocialMedia(post.mediaURL);
    await deleteSocialPost(post.id);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <img
          src={post.authorPhoto || `https://ui-avatars.com/api/?name=${post.authorName}&background=34A0A4&color=fff&size=32`}
          alt={post.authorName}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{post.authorName}</p>
          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{post.content}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Report count badge */}
          {reports.length > 0 && (
            <button
              onClick={() => setShowReports(!showReports)}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700"
            >
              <AlertTriangle className="w-3 h-3" />
              {reports.length}
              {showReports ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          {post.blocked && (
            <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-red-50 text-red-600">
              Blocked
            </span>
          )}

          <button
            onClick={handleBlock}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
            title={post.blocked ? 'Unblock' : 'Block'}
          >
            {post.blocked ? <ShieldAlert className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable reports */}
      {showReports && reports.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
          <p className="text-xs font-medium text-slate-500">Reports</p>
          {reports.map((r) => (
            <div key={r.uid} className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-600">{r.reason}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {r.reportedAt.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
