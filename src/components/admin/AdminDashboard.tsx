import { useState } from 'react';
import { FileText, Users } from 'lucide-react';
import PostManager from './PostManager';
import UserManager from './UserManager';

type AdminTab = 'posts' | 'users';

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('posts');

  return (
    <div className="px-4 py-3">
      <h2 className="text-lg font-bold text-slate-800 mb-3">Admin Dashboard</h2>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('posts')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'posts'
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Posts
        </button>
        <button
          onClick={() => setTab('users')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'users'
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Users
        </button>
      </div>

      {tab === 'posts' ? <PostManager /> : <UserManager />}
    </div>
  );
}
