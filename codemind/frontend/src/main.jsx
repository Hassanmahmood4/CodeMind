// Set Clerk publishable key on globalThis before Clerk loads (see clerk-env.js)
import './clerk-env';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/react';
import App from './App';
import LoadingScreen from './components/LoadingScreen';
import './styles/globals.css';

// Read publishable key (same as clerk-env; used for validation and passing to ClerkProvider)
const rawKey = String(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? '')
  .trim()
  .replace(/^["']|["']$/g, '')
  .replace(/\r\n|\r|\n/g, '')
  .replace(/\s/g, '');
const PUBLISHABLE_KEY = rawKey.includes('=pk_')
  ? (rawKey.split('=').find((part) => part.startsWith('pk_')) || rawKey).replace(/\s/g, '')
  : rawKey;

// 5. Console log to confirm the key loads (log presence + length only, not the key value)
if (typeof window !== 'undefined') {
  if (PUBLISHABLE_KEY && (PUBLISHABLE_KEY.startsWith('pk_test_') || PUBLISHABLE_KEY.startsWith('pk_live_'))) {
    console.log('[Clerk] Publishable key loaded:', PUBLISHABLE_KEY.length, 'chars');
    if (PUBLISHABLE_KEY.length < 58) {
      console.warn('[Clerk] Key is', PUBLISHABLE_KEY.length, 'chars — use the copy icon in the dashboard to get the full key.');
    }
  } else {
    console.warn('[Clerk] Publishable key missing or invalid. Set VITE_CLERK_PUBLISHABLE_KEY in .env and restart dev server.');
  }
}

// Accept 58+ char keys (your key is 58 chars)
const MIN_PUBLISHABLE_KEY_LENGTH = 58;
const isValidPublishableKey = (key) =>
  key &&
  typeof key === 'string' &&
  key.length >= MIN_PUBLISHABLE_KEY_LENGTH &&
  (key.startsWith('pk_test_') || key.startsWith('pk_live_'));

const isClerkKeyError = (msg) =>
  msg &&
  typeof msg === 'string' &&
  /publishable\s*key|Publishable\s*key|missing.*key|key.*missing/i.test(msg);

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(err) {
    return { error: err };
  }
  render() {
    if (this.state.error) {
      const msg = this.state.error?.message || '';
      if (isClerkKeyError(msg)) {
        return <NoKeyMessage keyLength={PUBLISHABLE_KEY?.length ?? 0} />;
      }
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#e2e8f0', padding: '1.5rem', fontFamily: 'sans-serif' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
            <pre style={{ background: '#1e293b', padding: '1rem', borderRadius: 8, overflow: 'auto', fontSize: '0.875rem' }}>{msg}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function NoKeyMessage({ keyLength = 0 }) {
  const keyStatus =
    keyLength === 0
      ? 'Key not loaded — add VITE_CLERK_PUBLISHABLE_KEY to codemind/frontend/.env, then restart: cd codemind/frontend && npm run dev'
      : keyLength < MIN_PUBLISHABLE_KEY_LENGTH
        ? `Key too short (${keyLength} chars) — copy the full key from the dashboard (use the copy icon, not Quick copy)`
        : `Key loaded (${keyLength} chars) but rejected — try adding http://localhost:5173 in Clerk Dashboard → Configure → Domains`;
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#e2e8f0', padding: '1.5rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '460px' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#e5e7eb' }}>CodeMind</h1>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', padding: '0.5rem 0.75rem', background: '#1e293b', borderRadius: 6 }}>{keyStatus}</p>
        <p style={{ color: '#94a3b8', marginBottom: '0.75rem' }}>Fix in <code style={{ background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: 4 }}>codemind/frontend/.env</code>:</p>
        <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}><code style={{ background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: 4 }}>VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code></p>
        <ol style={{ textAlign: 'left', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem', paddingLeft: '1.25rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Open the link below. Under <strong>Publishable key</strong>, click the <strong>copy icon</strong> next to the key (do not use &quot;Quick copy&quot; — that’s for Next.js and can be truncated).</li>
          <li style={{ marginBottom: '0.5rem' }}>In <code>.env</code> set one line: <code>VITE_CLERK_PUBLISHABLE_KEY=</code> then paste the full key (usually 59 characters). No quotes. Save the file.</li>
          <li>In terminal: Ctrl+C to stop the server, then <code>cd codemind/frontend && npm run dev</code>. Hard-refresh the browser (Cmd+Shift+R).</li>
        </ol>
        <a href="https://dashboard.clerk.com/last-active?path=api-keys" target="_blank" rel="noopener noreferrer" style={{ color: '#22d3ee', fontSize: '0.875rem', fontWeight: 500 }}>Open Clerk Dashboard → API Keys</a>
      </div>
    </div>
  );
}

function AppWithRouter() {
  const [showApp, setShowApp] = useState(false);
  const [clerkKeyError, setClerkKeyError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowApp(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onError = (event) => {
      const msg = event?.message || event?.reason?.message || String(event?.reason || '');
      if (isClerkKeyError(msg)) setClerkKeyError(true);
    };
    const onReject = (event) => {
      const msg = event?.reason?.message || String(event?.reason || '');
      if (isClerkKeyError(msg)) setClerkKeyError(true);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onReject);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onReject);
    };
  }, []);

  // Show setup screen when key is missing or invalid (ClerkProvider is still mounted once at root)
  if (clerkKeyError || !isValidPublishableKey(PUBLISHABLE_KEY)) {
    return <NoKeyMessage keyLength={PUBLISHABLE_KEY?.length ?? 0} />;
  }

  return (
    <BrowserRouter>
      {!showApp ? <LoadingScreen /> : <App />}
    </BrowserRouter>
  );
}

// Only mount Clerk when we have a valid key; otherwise show setup screen (avoids Clerk "Publishable key is missing")
const root = document.getElementById('root');
if (!isValidPublishableKey(PUBLISHABLE_KEY)) {
  ReactDOM.createRoot(root).render(
    <NoKeyMessage keyLength={PUBLISHABLE_KEY?.length ?? 0} />
  );
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ErrorBoundary>
          <ClerkLoading>
            <LoadingScreen />
          </ClerkLoading>
          <ClerkLoaded>
            <AppWithRouter />
          </ClerkLoaded>
        </ErrorBoundary>
      </ClerkProvider>
    </React.StrictMode>
  );
}
