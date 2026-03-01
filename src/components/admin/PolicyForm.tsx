import { useState } from 'react';
import { X } from 'lucide-react';
import { createPolicy, updatePolicy } from '../../api/policyApi';
import type { Policy } from '../../api/types';

interface PolicyFormProps {
  policy?: Policy;
  onClose: () => void;
  onSaved: () => void;
}

const DEPARTMENTS = ['HR', 'Admin', 'IT', 'Academics', 'Finance', 'General'];

export default function PolicyForm({ policy, onClose, onSaved }: PolicyFormProps) {
  const [title, setTitle] = useState(policy?.title ?? '');
  const [department, setDepartment] = useState(policy?.department ?? 'General');
  const [content, setContent] = useState(policy?.content ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      if (policy) {
        await updatePolicy(policy.id, { title, department, content });
      } else {
        await createPolicy({ title, department, content });
      }
      onSaved();
    } catch (err) {
      console.error('Failed to save policy:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {policy ? 'Edit Policy' : 'New Policy'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Policy title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Write the policy content..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim() || !content.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : policy ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
