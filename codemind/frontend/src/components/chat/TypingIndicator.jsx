export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-neutral-900 border border-neutral-800 px-5 py-3.5 shadow-sm shadow-black/20">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
