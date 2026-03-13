/**
 * Terminal-style loader: prints init steps like a dev environment, then "ready." with blinking cursor.
 * Used on app start and can be reused for AI review loading.
 * Text is visible (opacity: 1) and lines fade in sequentially via animation.
 */
const LINES = [
  '> initializing codemind...',
  '> installing dependencies...',
  '> fetching AI models...',
  '> connecting to review engine...',
  '> ready.',
];

export default function TerminalLoader() {
  return (
    <div
      className="terminal-loader fixed inset-0 flex items-center justify-center bg-[#0b0b0b] font-mono"
      style={{ fontFamily: 'var(--font-logo), "JetBrains Mono", "Fira Code", "Source Code Pro", monospace' }}
    >
      <div className="terminal-window w-[420px] rounded-[10px] bg-[#111] px-7 py-7 text-[#d1d5db] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        {LINES.map((text, i) => (
          <p
            key={i}
            className={`terminal-line my-1.5 text-sm ${
              i === LINES.length - 1 ? 'ready text-emerald-500' : ''
            }`}
            style={{
              animation: 'terminal-fade-in 0.4s ease-out forwards',
              animationDelay: `${0.2 + i * 0.6}s`,
              opacity: 0,
            }}
          >
            {text}
            {i === LINES.length - 1 && (
              <span className="cursor ml-1 inline-block" aria-hidden>
                _
              </span>
            )}
          </p>
        ))}
      </div>
      <style>{`
        @keyframes terminal-fade-in {
          to { opacity: 1; }
        }
        .terminal-loader { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; }
        .terminal-window p { margin: 6px 0; }
        .terminal-window .ready { color: #22c55e; }
        .cursor { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
