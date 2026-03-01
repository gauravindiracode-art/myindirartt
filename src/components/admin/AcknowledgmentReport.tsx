import { useEffect, useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { getAllUsers } from '../../api/userApi';
import { subscribeToResponses } from '../../api/acknowledgmentApi';
import type { AcknowledgmentPost, AcknowledgmentResponse, AppUser } from '../../api/types';

interface AcknowledgmentReportProps {
  post: AcknowledgmentPost;
  onBack: () => void;
}

export default function AcknowledgmentReport({ post, onBack }: AcknowledgmentReportProps) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [responses, setResponses] = useState<AcknowledgmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((allUsers) => {
      const filtered = allUsers.filter((u) => {
        if (u.role === 'admin') return false;
        if (post.targetAudience === 'both') return true;
        return u.role === post.targetAudience;
      });
      setUsers(filtered);
      setLoading(false);
    });
  }, [post.targetAudience]);

  useEffect(() => {
    return subscribeToResponses(post.id, setResponses);
  }, [post.id]);

  const respondedUids = new Set(responses.map((r) => r.uid));
  const ackCount = users.filter((u) => respondedUids.has(u.uid)).length;
  const total = users.length;
  const percent = total > 0 ? Math.round((ackCount / total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-primary font-medium mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h3 className="text-base font-semibold text-slate-800 mb-1">{post.title}</h3>
      <p className="text-xs text-slate-400 mb-4">Acknowledgment Report</p>

      {/* Progress */}
      <div className="bg-neu rounded-2xl p-4 mb-4 neu">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            {ackCount} of {total} acknowledged
          </span>
          <span className="text-sm font-semibold text-primary">{percent}%</span>
        </div>
        <div className="w-full h-2.5 bg-neu rounded-full overflow-hidden neu-inset-sm">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* User list */}
      <div className="space-y-2">
        {users.map((u) => {
          const acked = respondedUids.has(u.uid);
          return (
            <div
              key={u.uid}
              className="flex items-center gap-3 p-2.5 bg-neu rounded-xl neu-sm"
            >
              <img
                src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}&background=34A0A4&color=fff&size=32`}
                alt={u.displayName}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{u.displayName}</p>
                <p className="text-[10px] text-slate-400 capitalize">{u.role}</p>
              </div>
              {acked ? (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="w-3.5 h-3.5" />
                  Done
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <X className="w-3.5 h-3.5" />
                  Pending
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
