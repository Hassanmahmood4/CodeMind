import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * Terminal-style logo: # CodeMind_ with blinking cursor.
 * Uses monospace font (JetBrains Mono) and comment-style hash.
 */
export default function Logo({ className, asLink = true }) {
  const content = (
    <div
      className={cn(
        'inline-flex items-center font-mono text-xl font-semibold',
        className
      )}
      style={{ fontFamily: 'var(--font-logo), "JetBrains Mono", "Fira Code", "Source Code Pro", monospace' }}
    >
      <span className="mr-1.5 text-emerald-500">#</span>
      <span className="text-zinc-200">CodeMind</span>
      <span
        className="ml-1 animate-cursor text-zinc-200"
        aria-hidden
      >
        _
      </span>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="transition-opacity hover:opacity-90" aria-label="CodeMind home">
        {content}
      </Link>
    );
  }
  return content;
}
