import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Archive } from 'lucide-react';
import { subscribeToPosts, deletePost, updatePost } from '../../api/postApi';
import type { Post } from '../../api/types';
import PostForm from '../posts/PostForm';

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>();

  useEffect(() => {
    return subscribeToPosts(setPosts);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    await deletePost(id);
  };

  const handleArchive = async (post: Post) => {
    await updatePost(post.id, { archived: !post.archived });
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingPost(undefined);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Posts ({posts.length})</h3>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium neu-sm hover:bg-primary-800 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Post
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
                {post.type} &middot; {post.createdAt.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => openEdit(post)}
                className="p-1.5 rounded-lg hover:neu-inset-sm text-slate-400 transition-all"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleArchive(post)}
                className="p-1.5 rounded-lg hover:neu-inset-sm text-slate-400 transition-all"
                title={post.archived ? 'Unarchive' : 'Archive'}
              >
                <Archive className="w-4 h-4" />
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
        <PostForm
          post={editingPost}
          onClose={() => setShowForm(false)}
          onSaved={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
