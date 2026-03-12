/**
 * VS Code-style editor background for the landing page.
 * Renders behind all content, non-interactive, with transparency and gradient overlay.
 */
export default function EditorBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden
    >
      {/* Editor window - slightly transparent */}
      <div className="absolute inset-0 flex flex-col bg-[#1e1e1e]/25">
        {/* Mac-style title bar */}
        <div className="flex shrink-0 items-center gap-2 border-b border-white/5 bg-black/20 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-500/80" />
          </div>
          <span className="ml-4 text-xs font-medium text-zinc-500">review.js</span>
        </div>

        {/* Code area - with subtle scroll animation */}
        <div className="flex-1 overflow-hidden py-4 pl-4 pr-8">
          <div className="animate-editor-float font-mono text-sm leading-relaxed">
            <div className="flex">
              <div className="w-8 shrink-0 select-none pr-4 text-right text-zinc-600">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                  <div key={n}>{n}</div>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div>
                  <span className="text-purple-400">function</span>
                  <span className="text-zinc-300"> analyzeCode</span>
                  <span className="text-zinc-300">(code)</span>
                  <span className="text-zinc-300"> {'{'}</span>
                </div>
                <div className="text-zinc-300 pl-2">
                  <span className="text-purple-400">const</span>
                  <span className="text-zinc-300"> issues = [];</span>
                </div>
                <div className="text-zinc-300 pl-2" />
                <div className="text-zinc-300 pl-2">
                  <span className="text-purple-400">if</span>
                  <span className="text-zinc-300">(code.</span>
                  <span className="text-yellow-300">includes</span>
                  <span className="text-zinc-300">(</span>
                  <span className="text-amber-300">"eval"</span>
                  <span className="text-zinc-300">)) {'{'}</span>
                </div>
                <div className="text-zinc-300 pl-4">
                  <span className="text-zinc-400">issues.</span>
                  <span className="text-yellow-300">push</span>
                  <span className="text-zinc-300">(</span>
                  <span className="text-amber-300">"Avoid using eval for security reasons"</span>
                  <span className="text-zinc-300">);</span>
                </div>
                <div className="text-zinc-300 pl-2">{'}'}</div>
                <div className="text-zinc-300 pl-2" />
                <div className="text-zinc-300 pl-2">
                  <span className="text-purple-400">return</span>
                  <span className="text-zinc-300"> issues;</span>
                </div>
                <div className="text-zinc-300">{'}'}</div>
                <div className="text-zinc-300" />
                <div className="text-zinc-300">
                  <span className="text-purple-400">const</span>
                  <span className="text-zinc-300"> result = analyzeCode(userCode);</span>
                </div>
                <div className="text-zinc-300">
                  <span className="text-zinc-400">console</span>
                  <span className="text-zinc-300">.</span>
                  <span className="text-yellow-300">log</span>
                  <span className="text-zinc-300">(result);</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark gradient overlay for readability */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/95 via-[#0a0a0a]/85 to-[#0a0a0a]/95"
        aria-hidden
      />
    </div>
  );
}
