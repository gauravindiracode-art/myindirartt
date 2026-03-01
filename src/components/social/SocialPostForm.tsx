import { useState, useRef } from 'react';
import { X, ImagePlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  createSocialPost,
  updateSocialPost,
  uploadSocialMedia,
  deleteSocialMedia,
} from '../../api/socialApi';
import type { SocialPost } from '../../api/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface SocialPostFormProps {
  post?: SocialPost | null;
  onClose: () => void;
}

export default function SocialPostForm({ post, onClose }: SocialPostFormProps) {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState(post?.content ?? '');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(post?.mediaURL ?? null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(post?.mediaType ?? null);
  const [removeExistingMedia, setRemoveExistingMedia] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!post;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be under 10 MB');
      return;
    }

    setError('');
    setMediaFile(file);
    setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    setMediaPreview(URL.createObjectURL(file));
    if (isEdit) setRemoveExistingMedia(true);
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileRef.current) fileRef.current.value = '';
    if (isEdit && post?.mediaURL) setRemoveExistingMedia(true);
  };

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;
    setSaving(true);
    setError('');

    try {
      let mediaURL: string | null = post?.mediaURL ?? null;
      let finalMediaType: 'image' | 'video' | null = post?.mediaType ?? null;

      // Upload new media if selected
      if (mediaFile) {
        const result = await uploadSocialMedia(user.uid, mediaFile);
        mediaURL = result.url;
        finalMediaType = result.type;
      }

      // Remove old media if replaced or cleared
      if (removeExistingMedia && post?.mediaURL) {
        await deleteSocialMedia(post.mediaURL);
        if (!mediaFile) {
          mediaURL = null;
          finalMediaType = null;
        }
      }

      if (isEdit) {
        await updateSocialPost(post.id, {
          content: content.trim(),
          mediaURL,
          mediaType: finalMediaType,
        });
      } else {
        await createSocialPost({
          content: content.trim(),
          mediaURL,
          mediaType: finalMediaType,
          authorUid: user.uid,
          authorName: user.displayName,
          authorPhoto: user.photoURL || '',
        });
      }

      onClose();
    } catch {
      setError('Failed to save post. Please try again.');
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

          {/* Media preview */}
          {mediaPreview && (
            <div className="relative">
              {mediaType === 'video' ? (
                <video src={mediaPreview} controls className="w-full rounded-xl max-h-60" />
              ) : (
                <img src={mediaPreview} alt="Preview" className="w-full rounded-xl max-h-60 object-cover" />
              )}
              <button
                onClick={clearMedia}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* File picker */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <ImagePlus className="w-4 h-4" />
            {mediaPreview ? 'Change media' : 'Add photo or video'}
          </button>

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
