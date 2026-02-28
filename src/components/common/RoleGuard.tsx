import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../api/types';

interface RoleGuardProps {
  allowed: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleGuard({ allowed, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();
  if (!user || !allowed.includes(user.role)) return <>{fallback}</>;
  return <>{children}</>;
}
