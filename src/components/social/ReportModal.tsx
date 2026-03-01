import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { reportSocialPost } from '../../api/socialApi';

interface ReportModalProps {
  postId: string;
  onClose: () => void;
}

export default function ReportModal({ postId, onClose }: ReportModalProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!user || !reason.trim()) return;
    setSaving(true);
    await reportSocialPost(postId, user.uid, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-neu w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl neu">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neu-dark/20">
          <h3 className="text-base font-semibold text-slate-800">Report Post</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:neu-inset-sm text-slate-400 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you reporting this post?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-neu text-sm neu-inset focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-neu-dark/20">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-neu neu-sm hover:neu-inset-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !reason.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white neu-sm hover:bg-red-700 disabled:opacity-50 transition-all"
          >
            {saving ? 'Sending...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
