import { useState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const EXAMPLE_URL = 'https://github.com/user/repository';

export default function RepoReview({
  onSubmit,
  loading,
  phase,
  error,
  isSignedIn,
}) {
  const [repoUrl, setRepoUrl] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = repoUrl.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className="flex h-full flex-col border-r border-neutral-800 bg-neutral-950">
      <div className="flex flex-1 flex-col justify-center p-6">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 text-neutral-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800">
              <Github className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Review Repository</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-neutral-500">
              Paste GitHub repository URL
            </label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder={EXAMPLE_URL}
              disabled={loading}
              className={cn(
                'w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 font-mono text-sm text-white placeholder:text-neutral-500',
                'focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600',
                'disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200'
              )}
            />
            {loading && (
              <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                <div className="h-full w-full animate-pulse rounded-full bg-neutral-600" />
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !repoUrl.trim() || !isSignedIn}
              className={cn(
                'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black',
                'hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-neutral-500',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white',
                'transition-all duration-200'
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {phase === 'analyzing' ? 'Analyzing files...' : 'Cloning repository...'}
                </>
              ) : (
                'Analyze Repository'
              )}
            </button>
          </form>
          {!isSignedIn && (
            <p className="mt-4 text-xs text-neutral-500">Sign in to analyze a repository.</p>
          )}
        </div>
      </div>
    </div>
  );
}
