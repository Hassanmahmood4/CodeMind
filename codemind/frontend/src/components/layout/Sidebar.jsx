import { Show, UserButton } from '@clerk/react';
import { FileCode, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuthModal } from '../../contexts/AuthModalContext';

export default function Sidebar({
  reviewHistory,
  onSelectReview,
  onNewReview,
  currentReviewId,
  isOpen,
  onClose,
}) {
  const { openAuthModal } = useAuthModal();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-800 bg-neutral-950 shadow-xl shadow-black/20 transition-transform duration-200 ease-out md:static md:translate-x-0 md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 px-4">
          <Link to="/" className="font-mono font-semibold text-white hover:text-zinc-200">
            <span className="text-white">CodeMind</span>
          </Link>
          <div className="flex items-center gap-1">
            <Show when="signed-out">
              <button
                type="button"
                onClick={() => openAuthModal('sign-in')}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
                aria-label="Sign in"
              >
                <User className="h-5 w-5" />
              </button>
            </Show>
            <Show when="signed-in">
              <UserButton afterSignOutUrl="/" />
            </Show>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-b border-neutral-800 px-3 py-2">
          <Show when="signed-out">
            <div className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-200">
              Guest Mode
            </div>
            <p className="px-2 text-xs text-neutral-500 leading-relaxed">Sign in to save reviews</p>
          </Show>
        </div>

        <Link
          to="/review"
          onClick={onNewReview}
          className="mx-3 mt-3 flex items-center gap-2 rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-sm text-neutral-300 transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px hover:text-white"
        >
          <FileCode className="h-4 w-4" />
          New Review
        </Link>

        <div className="flex-1 overflow-y-auto p-2">
          <p className="px-2 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Recent reviews
          </p>
          {!reviewHistory?.length ? (
            <p className="px-2 py-4 text-sm text-zinc-500">No reviews yet</p>
          ) : (
            <ul className="space-y-0.5">
              {reviewHistory.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelectReview(item.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200',
                      currentReviewId === item.id
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                    )}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="truncate">{item.title || 'Review'}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
