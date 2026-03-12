import { FileCode, Loader2 } from 'lucide-react';
import { LANGUAGES } from '../../hooks/useReview';
import { cn } from '../../lib/utils';

export default function ReviewInput({
  language,
  onLanguageChange,
  onSubmit,
  loading,
  disabled,
  isSignedIn,
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-neutral-800 bg-neutral-950 p-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-neutral-400">
          <FileCode className="h-4 w-4" />
          Language
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={loading}
          className={cn(
            'rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-sm text-white',
            'focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600',
            'disabled:opacity-60 transition-all duration-200'
          )}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || loading}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black',
            'hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-white/20',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white',
            'transition-all duration-300'
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your code...
            </>
          ) : (
            'Review Code'
          )}
        </button>
      </div>
      {!isSignedIn && (
        <p className="text-xs text-neutral-500">Sign in to submit code for AI review.</p>
      )}
    </div>
  );
}
