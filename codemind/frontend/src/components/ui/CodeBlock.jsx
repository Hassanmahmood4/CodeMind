import { useMemo } from 'react';
import CopyButton from './CopyButton';
import { getCodeText } from '../../lib/utils';

/**
 * Code block with header showing language (from markdown ```lang or language prop).
 * Accepts either code + language (direct) or children + className (from ReactMarkdown).
 */
export default function CodeBlock({ language: languageProp, code: codeProp, children, className }) {
  const language = useMemo(() => {
    if (languageProp != null && languageProp !== '') return String(languageProp).trim();
    const match = /language-(\w+)/.exec(className || '');
    return match ? match[1] : null;
  }, [languageProp, className]);

  const content = codeProp != null ? codeProp : children;
  const text = useMemo(() => getCodeText(content), [content]);
  const displayLabel = language ? language.toUpperCase() : 'CODE';

  return (
    <div className="my-3 overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-sm shadow-black/20">
      <div className="flex items-center justify-between border-b border-neutral-800 bg-black px-4 py-2.5">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {displayLabel}
        </span>
        <CopyButton text={text} className="shrink-0" />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className={className || (language ? `language-${language}` : undefined)}>
          {content}
        </code>
      </pre>
    </div>
  );
}
