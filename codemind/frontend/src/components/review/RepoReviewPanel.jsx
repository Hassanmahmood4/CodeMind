import { FileCode, MessageSquare, Bug, Lightbulb, Shield } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import CodeBlock from '../ui/CodeBlock';
import { cn } from '../../lib/utils';

const TYPE_CONFIG = {
  bug: { icon: Bug, label: 'Bug', className: 'bg-neutral-800 border border-neutral-700 text-neutral-200' },
  suggestion: { icon: Lightbulb, label: 'Suggestion', className: 'bg-neutral-900 border border-neutral-800 text-neutral-200' },
  'best-practice': { icon: Shield, label: 'Best practice', className: 'bg-neutral-800 border border-neutral-700 text-neutral-200' },
};

export default function RepoReviewPanel({ repoResult, loading, error }) {
  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <LoadingSpinner className="h-10 w-10" />
        <p className="text-sm text-zinc-400">Analyzing repository...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 px-5 py-4 text-sm text-neutral-200 shadow-sm shadow-black/20">
          {error}
        </div>
      </div>
    );
  }

  if (!repoResult) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No repository review yet"
        description="Paste a GitHub repository URL and click Analyze Repository to get AI feedback on the codebase."
      />
    );
  }

  const { repoName, filesAnalyzed, suggestions } = repoResult;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="mb-4 rounded-xl bg-neutral-900 border border-neutral-800 px-5 py-4 shadow-sm shadow-black/20 transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px">
        <h3 className="text-base font-semibold text-white">{repoName}</h3>
        <p className="mt-2 text-sm text-neutral-400">
          {filesAnalyzed.length} file{filesAnalyzed.length !== 1 ? 's' : ''} analyzed
        </p>
        <ul className="mt-3 max-h-24 space-y-0.5 overflow-y-auto font-mono text-xs text-neutral-500">
          {filesAnalyzed.map((f) => (
            <li key={f} className="truncate">
              <FileCode className="mr-1.5 inline h-3 w-3 shrink-0 text-zinc-500" />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        {suggestions.map((s, i) => {
          const config = TYPE_CONFIG[s.type] || TYPE_CONFIG.suggestion;
          const Icon = config.icon;
          return (
            <div
              key={i}
              className={cn(
                'rounded-xl px-5 py-4 shadow-sm shadow-black/20 transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px',
                config.className
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800">
                  <Icon className="h-4 w-4 shrink-0" />
                </div>
                <span className="text-sm font-semibold text-white">{config.label}</span>
                {s.file && s.file !== '(summary)' && (
                  <span className="truncate font-mono text-xs text-neutral-400">
                    {s.file}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-neutral-400">{s.issue}</p>
              {s.suggestedFix && (
                <div className="mt-4 max-h-48 overflow-y-auto rounded-lg bg-black border border-neutral-800 px-4 py-3">
                  <p className="mb-2 text-xs font-medium text-neutral-500">Suggested fix</p>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <CodeBlock className="text-xs">{s.suggestedFix}</CodeBlock>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
