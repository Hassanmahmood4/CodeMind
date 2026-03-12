import { useMemo } from 'react';
import CopyButton from './CopyButton';
import { getCodeText } from '../../lib/utils';

export default function CodeBlock({ children, className }) {
  const language = useMemo(() => {
    const match = /language-(\w+)/.exec(className || '');
    return match ? match[1] : null;
  }, [className]);

  const text = useMemo(() => getCodeText(children), [children]);

  return (
    <div className="my-3 overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-sm shadow-black/20">
      <div className="flex items-center justify-between border-b border-neutral-800 bg-black px-4 py-2.5">
        {language && (
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            {language}
          </span>
        )}
        <span className="flex-1" />
        <CopyButton text={text} className="shrink-0" />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
