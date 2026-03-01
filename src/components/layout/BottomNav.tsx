import { Home, MessageSquare, FileText, GraduationCap, Shield, ClipboardCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { to: '/posts', label: 'Posts', icon: <MessageSquare className="w-5 h-5" /> },
  { to: '/policies', label: 'Policies', icon: <FileText className="w-5 h-5" /> },
  { to: '/acknowledgments', label: 'Ack', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['student', 'employee'] },
  { to: '/academics', label: 'Academics', icon: <GraduationCap className="w-5 h-5" />, roles: ['student'] },
  { to: '/admin', label: 'Admin', icon: <Shield className="w-5 h-5" />, roles: ['admin'] },
];

export default function BottomNav() {
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
