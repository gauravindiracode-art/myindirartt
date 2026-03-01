import { useState } from 'react';
import { FileText, Users, ScrollText, ClipboardCheck } from 'lucide-react';
import PostManager from './PostManager';
import UserManager from './UserManager';
import PolicyManager from './PolicyManager';
import AcknowledgmentManager from './AcknowledgmentManager';

type AdminTab = 'posts' | 'users' | 'policies' | 'acknowledgments';

const TABS: { value: AdminTab; label: string; icon: typeof FileText }[] = [
  { value: 'posts', label: 'Posts', icon: FileText },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'policies', label: 'Policies', icon: ScrollText },
  { value: 'acknowledgments', label: 'Ack', icon: ClipboardCheck },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('posts');

  return (
    <div className="px-4 py-3">
      <h2 className="text-lg font-bold text-slate-800 mb-3">Admin Dashboard</h2>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                tab === t.value
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'posts' && <PostManager />}
      {tab === 'users' && <UserManager />}
      {tab === 'policies' && <PolicyManager />}
      {tab === 'acknowledgments' && <AcknowledgmentManager />}
    </div>
  );
}
