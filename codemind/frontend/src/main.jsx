// Must run first: set Clerk key on globalThis so @clerk/react sees it when it loads
import './clerk-env';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/react';
import App from './App';
import TerminalLoader from './components/ui/TerminalLoader';
import './styles/globals.css';

// Key: prefer inlined env (set by clerk-env on globalThis); fallback window then import.meta.env
const raw =
  (typeof globalThis !== 'undefined' && (globalThis.VITE_CLERK_PUBLISHABLE_KEY || globalThis.CLERK_PUBLISHABLE_KEY)) ||
  (typeof window !== 'undefined' && (window.VITE_CLERK_PUBLISHABLE_KEY || window.CLERK_PUBLISHABLE_KEY)) ||
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  '';
const clerkPubKey = String(raw).trim().replace(/^["']|["']$/g, '');

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to .env (same folder as package.json) and restart the dev server.');
}

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
        return (
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#e2e8f0', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ maxWidth: '460px' }}>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#e5e7eb' }}>CodeMind</h1>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Clerk publishable key error. Ensure <code style={{ background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: 4 }}>VITE_CLERK_PUBLISHABLE_KEY</code> is set in <code>.env</code> (same folder as package.json) and restart the dev server.</p>
              <a href="https://dashboard.clerk.com/last-active?path=api-keys" target="_blank" rel="noopener noreferrer" style={{ color: '#22d3ee', fontSize: '0.875rem', marginTop: '1rem', display: 'inline-block' }}>Clerk Dashboard → API Keys</a>
            </div>
          </div>
        );
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

function AppWithRouter() {
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowApp(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      {!showApp ? <TerminalLoader /> : <App />}
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ErrorBoundary>
        <ClerkLoading>
          <TerminalLoader />
        </ClerkLoading>
        <ClerkLoaded>
          <AppWithRouter />
        </ClerkLoaded>
      </ErrorBoundary>
    </ClerkProvider>
  </React.StrictMode>
);
