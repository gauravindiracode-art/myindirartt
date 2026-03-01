import { useState } from 'react';
import { FileText, Users, Users2, ScrollText, ClipboardCheck } from 'lucide-react';
import PostManager from './PostManager';
import UserManager from './UserManager';
import PolicyManager from './PolicyManager';
import AcknowledgmentManager from './AcknowledgmentManager';
import SocialPostManager from './SocialPostManager';

type AdminTab = 'posts' | 'users' | 'policies' | 'acknowledgments' | 'social';

const TABS: { value: AdminTab; label: string; icon: typeof FileText }[] = [
  { value: 'posts', label: 'Posts', icon: FileText },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'policies', label: 'Policies', icon: ScrollText },
  { value: 'acknowledgments', label: 'Ack', icon: ClipboardCheck },
  { value: 'social', label: 'Social', icon: Users2 },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('posts');

  return (
    <div className="px-4 md:px-6 py-3 md:py-6">
      <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-3">Admin Dashboard</h2>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.value
                  ? 'bg-primary text-white neu-sm'
                  : 'bg-neu text-slate-600 neu-sm hover:neu-inset-sm'
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
      {tab === 'social' && <SocialPostManager />}
    </div>
  );
}
