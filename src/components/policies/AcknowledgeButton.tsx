import { useEffect, useState } from 'react';
import { Check, Users } from 'lucide-react';
import { acknowledgePolicy, subscribeToAcknowledgments } from '../../api/policyApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Acknowledgment } from '../../api/types';

export default function AcknowledgeButton({ policyId }: { policyId: string }) {
  const { user } = useAuth();
  const [acks, setAcks] = useState<Acknowledgment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return subscribeToAcknowledgments(policyId, setAcks);
  }, [policyId]);

  const hasAcked = acks.some((a) => a.uid === user?.uid);

  const handleAcknowledge = async () => {
    if (!user || hasAcked) return;
    setLoading(true);
    try {
      await acknowledgePolicy(policyId, user.uid, user.displayName);
    } catch (err) {
      console.error('Failed to acknowledge:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleAcknowledge}
        disabled={hasAcked || loading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          hasAcked
            ? 'bg-green-50 text-green-700 neu-inset-sm'
            : 'bg-teal text-white neu-sm hover:bg-teal-400'
        } disabled:opacity-70`}
      >
        <Check className="w-4 h-4" />
        {hasAcked ? 'Acknowledged' : loading ? 'Acknowledging...' : 'I Acknowledge This Policy'}
      </button>

      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Users className="w-3.5 h-3.5" />
        <span>{acks.length} {acks.length === 1 ? 'person has' : 'people have'} acknowledged</span>
      </div>
    </div>
  );
}
