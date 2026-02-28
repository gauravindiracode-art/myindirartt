import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '../../api/userApi';
import type { AppUser, UserRole } from '../../api/types';
import LoadingSpinner from '../common/LoadingSpinner';

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-50 text-red-700 border-red-200',
  employee: 'bg-blue-50 text-blue-700 border-blue-200',
  student: 'bg-green-50 text-green-700 border-green-200',
};

export default function UserManager() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (uid: string, role: UserRole) => {
    await updateUserRole(uid, role);
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role } : u)),
    );
  };

  if (loading) return <LoadingSpinner text="Loading users..." />;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Users ({users.length})
      </h3>

      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u.uid}
            className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg"
          >
            <img
              src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}&background=34A0A4&color=fff&size=32`}
              alt={u.displayName}
              className="w-9 h-9 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{u.displayName}</p>
              <p className="text-xs text-slate-400 truncate">{u.email}</p>
            </div>
            <select
              value={u.role}
              onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole)}
              className={`px-2 py-1 rounded-lg text-xs font-medium border ${ROLE_COLORS[u.role]} focus:outline-none`}
            >
              <option value="student">Student</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
