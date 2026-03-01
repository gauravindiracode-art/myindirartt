import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createSocialPost, updateSocialPost } from '../../api/socialApi';
import type { SocialPost } from '../../api/types';

interface SocialPostFormProps {
  post?: SocialPost | null;
  onClose: () => void;
}

export default function SocialPostForm({ post, onClose }: SocialPostFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState(post?.content ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!post;

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;
    setSaving(true);
    setError('');

    try {
      if (isEdit) {
        await updateSocialPost(post.id, { content: content.trim() });
      } else {
        await createSocialPost({
          content: content.trim(),
          mediaURL: null,
          mediaType: null,
          authorUid: user.uid,
          authorName: user.displayName,
          authorPhoto: user.photoURL || '',
        });
      }
      onClose();
    } catch (err) {
      console.error('SocialPostForm error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">
            {isEdit ? 'Edit Post' : 'Create Post'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
          />

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !content.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
