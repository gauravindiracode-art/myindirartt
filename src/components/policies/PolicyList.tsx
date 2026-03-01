import { useEffect, useState } from 'react';
import { subscribeToPolicies } from '../../api/policyApi';
import type { Policy } from '../../api/types';
import PolicyDetail from './PolicyDetail';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

export default function PolicyList() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDept, setActiveDept] = useState('All');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    const unsub = subscribeToPolicies((data) => {
      setPolicies(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const departments = ['All', ...new Set(policies.map((p) => p.department))];
  const filtered = activeDept === 'All' ? policies : policies.filter((p) => p.department === activeDept);

  if (selectedPolicy) {
    return <PolicyDetail policy={selectedPolicy} onBack={() => setSelectedPolicy(null)} />;
  }

  return (
    <div>
      {/* Department tabs */}
      <div className="flex gap-2 px-4 md:px-6 py-3 overflow-x-auto">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeDept === dept
                ? 'bg-teal text-white neu-sm'
                : 'bg-neu text-slate-600 neu-sm hover:neu-inset-sm'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState title="No policies" message="No policies available for this department." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6 pb-4">
          {filtered.map((policy) => (
            <button
              key={policy.id}
              onClick={() => setSelectedPolicy(policy)}
              className="bg-neu rounded-2xl p-4 text-left neu hover:neu-inset transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{policy.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {policy.department} &middot; {policy.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-teal-50 text-teal rounded-full text-[10px] font-medium shrink-0">
                  {policy.department}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{policy.content}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
