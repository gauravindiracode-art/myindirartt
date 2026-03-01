import { ArrowLeft } from 'lucide-react';
import type { Policy } from '../../api/types';
import AcknowledgeButton from './AcknowledgeButton';

interface PolicyDetailProps {
  policy: Policy;
  onBack: () => void;
}

export default function PolicyDetail({ policy, onBack }: PolicyDetailProps) {
  return (
    <div className="px-4 md:px-6 py-3 md:py-6 max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-primary font-medium mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to policies
      </button>

      {/* Policy content */}
      <div className="bg-neu rounded-2xl p-5 md:p-8 neu">
        <span className="px-2 py-0.5 bg-teal-50 text-teal rounded-full text-[10px] font-medium">
          {policy.department}
        </span>

        <h2 className="text-xl font-bold text-slate-900 mt-3 mb-1">{policy.title}</h2>
        <p className="text-xs text-slate-400 mb-4">
          Published on {policy.createdAt.toLocaleDateString()}
        </p>

        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {policy.content}
        </div>

        {/* Acknowledge */}
        <div className="mt-6 pt-4 border-t border-neu-dark/20">
          <AcknowledgeButton policyId={policy.id} />
        </div>
      </div>
    </div>
  );
}
