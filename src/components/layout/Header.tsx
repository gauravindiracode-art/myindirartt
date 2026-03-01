import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        {/* Mobile branding — hidden on desktop where sidebar shows it */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-sm">IU</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">Indira University</h1>
        </div>

        {/* Desktop spacer */}
        <div className="hidden md:block" />

        {user && (
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=34A0A4&color=fff`}
              alt={user.displayName}
              className="w-8 h-8 rounded-full border-2 border-white/30"
            />
            <span className="hidden md:block text-sm font-medium">{user.displayName}</span>
            <button
              onClick={signOut}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
