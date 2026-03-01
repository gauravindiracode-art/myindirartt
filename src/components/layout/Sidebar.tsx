import { Home, MessageSquare, FileText, GraduationCap, Shield, ClipboardCheck, Users2 } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
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
  { to: '/social', label: 'Social', icon: <Users2 className="w-5 h-5" /> },
  { to: '/policies', label: 'Policies', icon: <FileText className="w-5 h-5" /> },
  { to: '/acknowledgments', label: 'Acknowledgments', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['student', 'employee'] },
  { to: '/academics', label: 'Academics', icon: <GraduationCap className="w-5 h-5" />, roles: ['student'] },
  { to: '/admin', label: 'Admin', icon: <Shield className="w-5 h-5" />, roles: ['admin'] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 shrink-0">
      {/* Branding */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-100">
        <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
          <span className="text-primary font-bold text-sm">IU</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 leading-tight">Indira University</h1>
          <p className="text-[10px] text-slate-400">Student Portal</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive(item.to)
                ? 'bg-primary-50 text-primary'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      {user && (
        <div className="px-4 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=34A0A4&color=fff`}
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">{user.displayName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
