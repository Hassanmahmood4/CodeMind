import { Show, useUser, UserButton } from '@clerk/react';
import { Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuthModal } from '../../contexts/AuthModalContext';

export default function Header({ onMenuClick, className }) {
  const { openAuthModal } = useAuthModal();
  const { user } = useUser();

  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 backdrop-blur-sm',
        className
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="flex items-center justify-center rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Link to="/" className="flex items-center gap-2 font-mono font-semibold text-white hover:text-zinc-200">
        <span className="text-white">CodeMind</span>
      </Link>
      <div className="flex items-center gap-2">
        <Show when="signed-out">
          <button
            type="button"
            onClick={() => openAuthModal('sign-in')}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-zinc-100"
          >
            <User className="h-4 w-4" />
            Log in
          </button>
        </Show>
        <Show when="signed-in">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-300">
              {user?.username || user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </Show>
      </div>
    </header>
  );
}
