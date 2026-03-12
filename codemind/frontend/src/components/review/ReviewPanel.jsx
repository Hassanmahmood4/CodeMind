import { MessageSquare } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import ReviewMessage from './ReviewMessage';

export default function ReviewPanel({ review, loading }) {
  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <LoadingSpinner className="h-10 w-10" />
        <p className="text-sm text-zinc-400">Analyzing your code...</p>
      </div>
    );
  }

  if (!review) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No review yet"
        description="Paste or type code in the editor, then click Review Code to get AI feedback."
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="space-y-4">
        <ReviewMessage content={review} defaultOpen={true} />
      </div>
    </div>
  );
}
