import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { subscribeToPolicies, deletePolicy } from '../../api/policyApi';
import type { Policy } from '../../api/types';
import PolicyForm from './PolicyForm';

export default function PolicyManager() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | undefined>();

  useEffect(() => {
    return subscribeToPolicies(setPolicies);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this policy permanently?')) return;
    await deletePolicy(id);
  };

  const openEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingPolicy(undefined);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Policies ({policies.length})</h3>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium neu-sm hover:bg-primary-800 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Policy
        </button>
      </div>

      <div className="space-y-2.5">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="flex items-center gap-3 p-3 bg-neu rounded-xl neu-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{policy.title}</p>
              <p className="text-xs text-slate-400">
                {policy.department} &middot; {policy.createdAt.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => openEdit(policy)}
                className="p-1.5 rounded-lg hover:neu-inset-sm text-slate-400 transition-all"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(policy.id)}
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
        <PolicyForm
          policy={editingPolicy}
          onClose={() => setShowForm(false)}
          onSaved={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
