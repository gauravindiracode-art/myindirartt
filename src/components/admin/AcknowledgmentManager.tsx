import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, BarChart3 } from 'lucide-react';
import {
  subscribeToAcknowledgmentPosts,
  deleteAcknowledgmentPost,
} from '../../api/acknowledgmentApi';
import type { AcknowledgmentPost } from '../../api/types';
import AcknowledgmentForm from './AcknowledgmentForm';
import AcknowledgmentReport from './AcknowledgmentReport';

const AUDIENCE_LABELS: Record<string, string> = {
  student: 'Students',
  employee: 'Employees',
  both: 'Everyone',
};

export default function AcknowledgmentManager() {
  const [posts, setPosts] = useState<AcknowledgmentPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<AcknowledgmentPost | undefined>();
  const [reportPost, setReportPost] = useState<AcknowledgmentPost | null>(null);

  useEffect(() => {
    return subscribeToAcknowledgmentPosts(setPosts);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this acknowledgment permanently?')) return;
    await deleteAcknowledgmentPost(id);
  };

  const openEdit = (post: AcknowledgmentPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingPost(undefined);
    setShowForm(true);
  };

  if (reportPost) {
    return <AcknowledgmentReport post={reportPost} onBack={() => setReportPost(null)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Acknowledgments ({posts.length})
        </h3>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium neu-sm hover:bg-primary-800 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </button>
      </div>

      <div className="space-y-2.5">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center gap-3 p-3 bg-neu rounded-xl neu-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{post.title}</p>
              <p className="text-xs text-slate-400">
                {AUDIENCE_LABELS[post.targetAudience]} &middot;{' '}
                {post.createdAt.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setReportPost(post)}
                className="p-1.5 rounded-lg hover:neu-inset-sm text-slate-400 transition-all"
                title="Report"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => openEdit(post)}
                className="p-1.5 rounded-lg hover:neu-inset-sm text-slate-400 transition-all"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="p-1.5 rounded-lg hover:neu-inset-sm text-red-400 transition-all"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <AcknowledgmentForm
          post={editingPost}
          onClose={() => setShowForm(false)}
          onSaved={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
