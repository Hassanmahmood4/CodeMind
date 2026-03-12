import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import CodeBlock from '../ui/CodeBlock';
import { cn } from '../../lib/utils';

export default function ReviewMessage({ content, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="animate-slide-in-bottom rounded-xl bg-neutral-900 border border-neutral-800 shadow-sm shadow-black/20 overflow-hidden transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-6 py-4 text-left transition-colors hover:bg-neutral-800/50"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-neutral-500" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-neutral-500" />
        )}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-neutral-400" />
        </div>
        <span className="text-base font-semibold text-white">Review feedback</span>
      </button>
      {open && (
        <div className="border-t border-neutral-800 px-6 py-4">
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-pre:my-2 prose-headings:my-3">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  return inline ? (
                    <code
                      className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-200 font-mono text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <CodeBlock className={className}>{children}</CodeBlock>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
