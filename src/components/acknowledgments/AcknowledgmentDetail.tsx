import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Users } from 'lucide-react';
import { submitAcknowledgment, subscribeToResponses } from '../../api/acknowledgmentApi';
import { useAuth } from '../../contexts/AuthContext';
import type { AcknowledgmentPost, AcknowledgmentResponse } from '../../api/types';

interface AcknowledgmentDetailProps {
  post: AcknowledgmentPost;
  onBack: () => void;
}

export default function AcknowledgmentDetail({ post, onBack }: AcknowledgmentDetailProps) {
  const { user } = useAuth();
  const [responses, setResponses] = useState<AcknowledgmentResponse[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return subscribeToResponses(post.id, setResponses);
  }, [post.id]);

  const hasAcked = responses.some((r) => r.uid === user?.uid);

  const handleAcknowledge = async () => {
    if (!user || hasAcked) return;
    setSubmitting(true);
    try {
      await submitAcknowledgment(post.id, user.uid, user.displayName, user.role);
    } catch (err) {
      console.error('Failed to acknowledge:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 md:px-6 py-3 md:py-6 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-primary font-medium mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white border border-slate-100 rounded-xl p-5 md:p-8 shadow-sm">
        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-medium capitalize">
          {post.targetAudience === 'both' ? 'Everyone' : `${post.targetAudience}s`}
        </span>

        <h2 className="text-xl font-bold text-slate-900 mt-3 mb-1">{post.title}</h2>
        <p className="text-xs text-slate-400 mb-4">
          By {post.authorName} &middot; {post.createdAt.toLocaleDateString()}
        </p>

        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
          <button
            onClick={handleAcknowledge}
            disabled={hasAcked || submitting}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              hasAcked
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-primary text-white hover:bg-primary-800'
            } disabled:opacity-70`}
          >
            <Check className="w-4 h-4" />
            {hasAcked ? 'Acknowledged' : submitting ? 'Submitting...' : 'Read & Acknowledge'}
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5" />
            <span>
              {responses.length} {responses.length === 1 ? 'person has' : 'people have'}{' '}
              acknowledged
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
