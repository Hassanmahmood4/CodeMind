import { cn } from '../../lib/utils';

export default function LoadingSpinner({ className }) {
  return (
    <div
      className={cn('h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/60', className)}
      role="status"
      aria-label="Loading"
    />
  );
}
