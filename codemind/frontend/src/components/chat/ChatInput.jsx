import { useState, useRef, useCallback, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed && !disabled) {
        onSend(trimmed);
        setValue('');
      }
    },
    [value, disabled, onSend]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    if (!value) adjustHeight();
  }, [value, adjustHeight]);

  return (
    <div className="sticky bottom-0 border-t border-neutral-800 bg-neutral-950/95 px-4 py-4 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            requestAnimationFrame(adjustHeight);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about code... (Enter to send, Shift+Enter for new line)"
          rows={1}
          disabled={disabled}
          className={cn(
            'min-h-[52px] max-h-40 flex-1 resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3.5 text-sm text-white placeholder-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600',
            'disabled:cursor-not-allowed disabled:opacity-60',
            'transition-all duration-200'
          )}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={cn(
            'flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-white text-black',
            'hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-white/20',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white',
            'transition-all duration-300'
          )}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
