import { useState } from 'react';
import { X } from 'lucide-react';
import { createAcknowledgmentPost, updateAcknowledgmentPost } from '../../api/acknowledgmentApi';
import { useAuth } from '../../contexts/AuthContext';
import type { AcknowledgmentPost, AcknowledgmentAudience } from '../../api/types';

interface AcknowledgmentFormProps {
  post?: AcknowledgmentPost;
  onClose: () => void;
  onSaved: () => void;
}

const AUDIENCES: { value: AcknowledgmentAudience; label: string }[] = [
  { value: 'student', label: 'Students' },
  { value: 'employee', label: 'Employees' },
  { value: 'both', label: 'Both' },
];

export default function AcknowledgmentForm({ post, onClose, onSaved }: AcknowledgmentFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(post?.title ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [targetAudience, setTargetAudience] = useState<AcknowledgmentAudience>(
    post?.targetAudience ?? 'both',
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      if (post) {
        await updateAcknowledgmentPost(post.id, { title, content, targetAudience });
      } else {
        await createAcknowledgmentPost({
          title,
          content,
          targetAudience,
          authorName: user.displayName,
        });
      }
      onSaved();
    } catch (err) {
      console.error('Failed to save acknowledgment:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-neu rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto neu">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neu-dark/20">
          <h2 className="text-lg font-semibold text-slate-800">
            {post ? 'Edit Acknowledgment' : 'New Acknowledgment'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:neu-inset-sm transition-all">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
            <div className="flex gap-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setTargetAudience(a.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    targetAudience === a.value
                      ? 'bg-primary text-white neu-sm'
                      : 'bg-neu text-slate-600 neu-sm hover:neu-inset-sm'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-neu rounded-lg text-sm neu-inset-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Acknowledgment title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 bg-neu rounded-lg text-sm neu-inset-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Write the acknowledgment content..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-neu neu-sm hover:neu-inset-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim() || !content.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary neu-sm hover:bg-primary-800 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : post ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
