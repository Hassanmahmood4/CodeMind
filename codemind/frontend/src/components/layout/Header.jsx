import { Show, useUser, UserButton } from '@clerk/react';
import { Menu, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthModal } from '../../contexts/AuthModalContext';
import Logo from '../ui/Logo';

export default function Header({ onMenuClick, className }) {
  const { openAuthModal } = useAuthModal();
  const { user } = useUser();

  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-950 px-4 py-4 md:px-6 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex shrink-0 items-center justify-center rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo />
      </div>
      <div className="flex shrink-0 items-center gap-3">
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
          <span className="hidden truncate text-sm text-gray-400 sm:inline">
            {user?.username || user?.primaryEmailAddress?.emailAddress}
          </span>
          <UserButton afterSignOutUrl="/" />
        </Show>
      </div>
    </header>
  );
}
