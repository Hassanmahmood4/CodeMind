import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Show, useUser, UserButton } from '@clerk/react';
import {
  FileCode,
  Bug,
  Languages,
  LogIn,
  Sparkles,
  ClipboardPaste,
  Brain,
  Lightbulb,
  Github,
  Menu,
  X,
  Zap,
  Code2,
  MessageSquare,
} from 'lucide-react';
import { useInView } from '../hooks/useInView';
import EditorBackground from '../components/ui/EditorBackground';
import Logo from '../components/ui/Logo';
import { useAuthModal } from '../contexts/AuthModalContext';

const features = [
  {
    icon: Sparkles,
    title: 'AI Code Analysis',
    description: 'Get intelligent feedback on style, performance, and best practices powered by advanced AI.',
  },
  {
    icon: Bug,
    title: 'Bug Detection',
    description: 'Catch potential bugs and security issues before they reach production.',
  },
  {
    icon: Languages,
    title: 'Multiple Language Support',
    description: 'JavaScript, TypeScript, Python, C++, Java and more. One tool for your whole stack.',
  },
  {
    icon: LogIn,
    title: 'Guest Mode + Clerk Login',
    description: 'Try instantly as a guest or sign in with Clerk to save and track your reviews.',
  },
];

const steps = [
  { icon: ClipboardPaste, title: 'Paste your code', desc: 'Drop your code into the editor or type it directly.' },
  { icon: Brain, title: 'AI analyzes it', desc: 'Our AI reviews structure, logic, and potential issues.' },
  { icon: Lightbulb, title: 'Get fixes and improvements', desc: 'Receive clear feedback and copy-paste fixes.' },
];

const devPoints = [
  { icon: Zap, text: 'Fast AI feedback in seconds' },
  { icon: Languages, text: 'Supports multiple programming languages' },
  { icon: Code2, text: 'Clean code suggestions and best practices' },
  { icon: MessageSquare, text: 'Instant bug explanations and fixes' },
];

function FeatureDemo({ title }) {
  // Mini “editor-like” preview shown on hover.
  if (title === 'AI Code Analysis') {
    return (
      <div className="w-full">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            <span className="font-mono">analysis.js</span>
          </div>
          <span className="rounded-full bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-300">
            AI
          </span>
        </div>
        <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 font-mono text-xs leading-relaxed text-neutral-200">
          <div>
            <span className="text-purple-400">function</span> <span className="text-neutral-100">sum</span>
            <span className="text-neutral-400">(</span>a,b<span className="text-neutral-400">)</span>
            <span className="text-neutral-400">{'{'}</span>
          </div>
          <div className="pl-3">
            <span className="text-purple-400">return</span> a+b
          </div>
          <div className="text-neutral-400">{'}'}</div>
        </div>
        <div className="mt-3 rounded-xl bg-neutral-900 border border-neutral-800 p-3 shadow-sm shadow-black/20">
          <p className="text-xs font-semibold text-white">Suggestion</p>
          <p className="mt-1 text-xs text-neutral-400">Add input validation for non-numeric values.</p>
        </div>
      </div>
    );
  }

  if (title === 'Bug Detection') {
    return (
      <div className="w-full">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-rose-500/70" />
            <span className="font-mono">auth.ts</span>
          </div>
          <span className="rounded-full bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-300">
            BUG
          </span>
        </div>
        <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 font-mono text-xs leading-relaxed text-neutral-200">
          <div>
            <span className="text-purple-400">if</span>
            <span className="text-neutral-400">(</span>
            user <span className="text-rose-300">=</span> <span className="text-purple-400">null</span>
            <span className="text-neutral-400">)</span>
            <span className="text-neutral-400">{'{'}</span>
          </div>
          <div className="pl-3 text-neutral-300">logout();</div>
          <div className="text-neutral-400">{'}'}</div>
          <div className="mt-2 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 shadow-sm shadow-black/20">
            <p className="text-xs font-semibold text-white">Bug detected</p>
            <p className="mt-1 text-xs text-neutral-400">Use <span className="font-mono text-neutral-200">===</span> instead of assignment.</p>
          </div>
        </div>
      </div>
    );
  }

  if (title === 'Multiple Language Support') {
    return (
      <div className="w-full">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-lg bg-neutral-800 border border-neutral-700 p-1">
            {['JS', 'Python', 'C++'].map((t, i) => (
              <span
                key={t}
                className={[
                  'rounded-md px-2 py-1 text-[10px] font-medium',
                  i === 0 ? 'bg-neutral-700 text-white' : 'text-neutral-400',
                ].join(' ')}
              >
                {t}
              </span>
            ))}
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">snippets</span>
        </div>
        <div className="grid gap-2">
          <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 font-mono text-xs text-neutral-200">
            <span className="text-neutral-500">// JS</span>
            <div className="mt-1">
              <span className="text-purple-400">const</span> ok = <span className="text-amber-300">true</span>
            </div>
          </div>
          <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 font-mono text-xs text-neutral-200 opacity-80">
            <span className="text-neutral-500"># Python</span>
            <div className="mt-1">
              <span className="text-purple-400">def</span> ping(): <span className="text-emerald-300">return</span> <span className="text-amber-300">True</span>
            </div>
          </div>
          <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 font-mono text-xs text-neutral-200 opacity-70">
            <span className="text-neutral-500">// C++</span>
            <div className="mt-1">
              <span className="text-purple-400">bool</span> ok = <span className="text-amber-300">true</span>;
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Guest Mode + Clerk Login
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-amber-500/70" />
          <span className="font-mono">session</span>
        </div>
        <span className="rounded-full bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-300">
          auth
        </span>
      </div>
      <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 shadow-sm shadow-black/20">
        <div className="flex items-center justify-between rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2">
          <div>
            <p className="text-xs font-semibold text-white">Guest Mode Active</p>
            <p className="mt-0.5 text-[11px] text-neutral-400">Limited history • No saved reviews</p>
          </div>
          <span className="rounded-full bg-neutral-700 px-2 py-1 text-[10px] font-medium text-neutral-200">
            ON
          </span>
        </div>
        <button
          type="button"
          className="mt-3 w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:border-neutral-600 hover:-translate-y-px"
        >
          Login with Clerk
        </button>
      </div>
    </div>
  );
}

export default function Landing() {
  const { openAuthModal } = useAuthModal();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresRef, featuresInView] = useInView();
  const [howRef, howInView] = useInView();
  const [demoRef, demoInView] = useInView();
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <EditorBackground />
      <div className="relative z-10">
      {/* Sticky Navbar - transparent, blur */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={() => scrollTo('features')}
              className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollTo('how')}
              className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              How it Works
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:text-white"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <Show when="signed-out">
              <button
                type="button"
                onClick={() => openAuthModal('sign-in')}
                className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Login
              </button>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-300">
                  {user?.username || user?.primaryEmailAddress?.emailAddress}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </Show>
            <Link
              to="/review"
              className="ml-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-zinc-200"
            >
              Start Reviewing
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="rounded-lg p-2 text-zinc-400 md:hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-800 bg-neutral-950/95 px-4 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => scrollTo('features')} className="rounded-lg px-3 py-2.5 text-left text-sm text-zinc-300">
                Features
              </button>
              <button type="button" onClick={() => scrollTo('how')} className="rounded-lg px-3 py-2.5 text-left text-sm text-zinc-300">
                How it Works
              </button>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-2.5 text-sm text-zinc-300">
                GitHub
              </a>
              <Show when="signed-out">
                <button
                  type="button"
                  onClick={() => { openAuthModal('sign-in'); setMobileMenuOpen(false); }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm text-zinc-300 w-full"
                >
                  Login
                </button>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                  <span className="text-sm text-neutral-300">
                    {user?.username || user?.primaryEmailAddress?.emailAddress}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </Show>
              <Link
                to="/review"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 rounded-lg bg-white px-4 py-3 text-center text-sm font-medium text-black"
              >
                Start Reviewing
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero - gradient, grid, large typography */}
        <section className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-40 sm:pb-32">
          {/* Animated grid background */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.15] animate-grid-pulse"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '64px 64px',
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.2),transparent_50%)] animate-glow" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(34,211,238,0.08),transparent)]" />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              AI Code Reviews{' '}
              <span className="text-white">
                in Seconds
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
              Paste your code and get instant AI feedback, bug detection, and improvement suggestions.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => openAuthModal('sign-in')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-black shadow-lg transition-all hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/10 sm:w-auto"
              >
                <LogIn className="h-5 w-5" />
                Login with Clerk
              </button>
              <Link
                to="/review"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 border border-neutral-800 px-6 py-3.5 text-base font-medium text-white transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px sm:w-auto"
              >
                Try as Guest
              </Link>
            </div>
          </div>
        </section>

        {/* Demo Preview - realistic AI code reviewer */}
        <section ref={demoRef} className="border-t border-neutral-800 px-4 py-24 sm:px-6 sm:py-32">
          <div className={`mx-auto max-w-6xl transition-all duration-700 ${demoInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
            <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
              See it in action
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400">
              Code editor, program output, and AI suggestions—just like the real tool.
            </p>
            <div className="mt-12 overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm shadow-black/20">
              {/* Tab labels */}
              <div className="flex border-b border-neutral-800 px-6 py-3">
                <span className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-xs font-medium text-white">Code Editor</span>
                <span className="ml-2 rounded-lg px-3 py-1.5 text-xs text-neutral-500">AI Review</span>
              </div>
              {/* Main content: code editor (code + output) | AI review (remarks) */}
              <div className="flex min-h-[360px] flex-col lg:flex-row">
                {/* Left: Code Editor — code + output only */}
                <div className="flex flex-1 flex-col border-r border-neutral-800 bg-neutral-950">
                  <div className="flex-1 p-4 font-mono text-sm leading-relaxed text-neutral-200">
                    <div className="flex">
                      <div className="w-8 shrink-0 select-none pr-4 text-right text-neutral-200">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
                          <div key={n} className="text-neutral-200">{n}</div>
                        ))}
                      </div>
                      <div className="min-w-0 flex-1 text-neutral-200">
                        <div><span className="text-purple-400">function</span><span className="text-zinc-300"> calculateTotal</span><span className="text-zinc-300">(items)</span><span className="text-zinc-300"> {'{'}</span></div>
                        <div className="text-zinc-300 pl-2"><span className="text-purple-400">let</span><span className="text-zinc-300"> total = 0;</span></div>
                        <div className="text-zinc-300 pl-2"><span className="text-purple-400">for</span><span className="text-zinc-300"> (</span><span className="text-purple-400">let</span><span className="text-zinc-300"> i = 0; i &lt; items.length; i++) {'{'}</span></div>
                        <div className="text-zinc-300 pl-4"><span className="text-zinc-400">total</span><span className="text-zinc-300"> += items[i].price;</span></div>
                        <div className="text-zinc-300 pl-2">{'}'}</div>
                        <div className="text-zinc-300 pl-2"><span className="text-purple-400">return</span><span className="text-zinc-300"> total;</span></div>
                        <div className="text-zinc-300">{'}'}</div>
                        <div className="text-zinc-300"><span className="text-purple-400">const</span><span className="text-zinc-300"> cart = [</span></div>
                        <div className="text-zinc-300 pl-2"><span className="text-zinc-300">{'{'}</span><span className="text-amber-300">"name"</span><span className="text-zinc-300">: </span><span className="text-amber-300">"Laptop"</span><span className="text-zinc-300">, </span><span className="text-amber-300">"price"</span><span className="text-zinc-300">: 1000 {'}'},</span></div>
                        <div className="text-zinc-300 pl-2"><span className="text-zinc-300">{'{'}</span><span className="text-amber-300">"name"</span><span className="text-zinc-300">: </span><span className="text-amber-300">"Mouse"</span><span className="text-zinc-300">, </span><span className="text-amber-300">"price"</span><span className="text-zinc-300">: 25 {'}'}</span></div>
                        <div className="text-zinc-300">];</div>
                        <div className="text-zinc-300"><span className="text-zinc-400">console</span><span className="text-zinc-300">.</span><span className="text-yellow-300">log</span><span className="text-zinc-300">(calculateTotal(cart));</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-neutral-800 px-6 py-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">Program Output</p>
                    <pre className="rounded-lg bg-black border border-neutral-800 px-4 py-3 font-mono text-sm text-green-400">1025</pre>
                  </div>
                </div>
                {/* Right: AI Review — remarks only */}
                <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-neutral-950 p-6">
                  <p className="mb-4 text-xs font-medium uppercase tracking-wider text-neutral-500">AI Review</p>
                  <div className="space-y-4">
                    <div className={`rounded-xl bg-neutral-900 border border-neutral-800 p-5 shadow-sm shadow-black/20 transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px ${demoInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0ms' }}>
                      <h4 className="text-base font-semibold text-white">Use Array.reduce for cleaner code</h4>
                      <p className="mt-2 text-sm text-neutral-400">The for-loop can be replaced with Array.reduce to make the function more declarative and readable.</p>
                    </div>
                    <div className={`rounded-xl bg-neutral-900 border border-neutral-800 p-5 shadow-sm shadow-black/20 transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px ${demoInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`} style={{ animationDelay: '150ms' }}>
                      <h4 className="text-base font-semibold text-white">Add input validation</h4>
                      <p className="mt-2 text-sm text-neutral-400">The function assumes items always contain a price property. Add validation to prevent runtime errors.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" ref={featuresRef} className="border-t border-neutral-800 px-4 py-24 sm:px-6 sm:py-32">
          <div className={`mx-auto max-w-6xl transition-all duration-700 ${featuresInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
            <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
              Everything you need to ship better code
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-400 leading-relaxed">
              Built for developers who want fast, actionable feedback.
            </p>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className={[
                    'group relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-sm shadow-black/20',
                    'transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px',
                  ].join(' ')}
                >
                  {/* Feature info (default) */}
                  <div className="transition-all duration-300 group-hover:opacity-0 group-hover:blur-[1px]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                    <p className="mt-3 text-sm text-neutral-400">{description}</p>
                  </div>

                  {/* Demo preview (hover) */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="pointer-events-none absolute inset-0 bg-neutral-950/95" />
                    <div className="relative flex h-full w-full items-center p-6">
                      <div className="w-full max-h-[260px] animate-fade-in overflow-y-auto overscroll-contain rounded-xl bg-neutral-900 border border-neutral-800 p-4 shadow-sm shadow-black/20">
                        <FeatureDemo title={title} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - timeline */}
        <section id="how" ref={howRef} className="border-t border-neutral-800 px-4 py-24 sm:px-6 sm:py-32">
          <div className={`mx-auto max-w-5xl transition-all duration-700 ${howInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
            <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400 leading-relaxed">
              Three steps to better code.
            </p>
            <div className="relative mt-16 flex flex-col items-stretch gap-12 md:flex-row md:items-center md:justify-between md:gap-4">
              {/* Connector line - behind cards, desktop only */}
              <div
                className="absolute left-0 right-0 top-1/2 z-0 hidden h-px -translate-y-1/2 bg-neutral-700 md:block"
                aria-hidden
              />
              {steps.map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  className="relative z-10 flex flex-1 flex-col items-center rounded-xl bg-neutral-900 border border-neutral-800 px-6 py-6 text-center shadow-sm shadow-black/20 transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px md:py-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="mt-4 text-sm font-medium text-neutral-500">Step {i + 1}</span>
                  <h3 className="mt-2 text-base font-semibold text-white">{title}</h3>
                  <p className="mt-3 max-w-xs text-sm text-neutral-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Friendly */}
        <section className="border-t border-neutral-800 px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
              Built for developers
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400 leading-relaxed">
              Why developers choose CodeMind for code reviews.
            </p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2">
              {devPoints.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-4 rounded-xl bg-neutral-900 border border-neutral-800 px-6 py-4 shadow-sm shadow-black/20 transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-neutral-200 text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-800 px-4 py-12 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
            <Logo />
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
              <button type="button" onClick={() => scrollTo('features')} className="transition-colors hover:text-white">
                Features
              </button>
              <button type="button" onClick={() => scrollTo('how')} className="transition-colors hover:text-white">
                How it Works
              </button>
              <Link to="/review" className="transition-colors hover:text-white">
                Product
              </Link>
              <button type="button" onClick={() => openAuthModal('sign-in')} className="transition-colors hover:text-white">
                Sign in
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </nav>
          </div>
          <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-zinc-500">
            Built for developers. AI-powered code reviews.
          </p>
        </footer>
      </main>
      </div>
    </div>
  );
}
