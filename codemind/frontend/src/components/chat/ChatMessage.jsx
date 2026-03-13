import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import CodeBlock from '../ui/CodeBlock';
import { cn } from '../../lib/utils';

export default function ChatMessage({ role, content, index }) {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'flex mb-4 animate-slide-in-bottom',
        isUser ? 'justify-end' : 'justify-start'
      )}
      style={{ animationDelay: `${Math.min(index * 50, 200)}ms` }}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-5 py-3.5 shadow-lg transition-all duration-300',
          isUser
            ? 'rounded-br-md bg-white text-black'
            : 'rounded-bl-md bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-sm shadow-black/20'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-pre:my-2">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const lang = className ? className.replace(/^language-/, '') : null;
                  return inline ? (
                    <code
                      className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <CodeBlock language={lang || undefined} className={className}>
                      {children}
                    </CodeBlock>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
