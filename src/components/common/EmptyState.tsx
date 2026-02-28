import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = 'Nothing here yet',
  message = 'Check back later for updates.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
      <Inbox className="w-12 h-12 text-slate-300" />
      <h3 className="text-lg font-semibold text-slate-600">{title}</h3>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}
