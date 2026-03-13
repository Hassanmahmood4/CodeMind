/**
 * Runs before @clerk/react loads. Sets Clerk publishable key on globalThis so the SDK
 * finds it. Use the exact literal below so Vite's define inlines the value from .env.
 */
const key = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '').trim().replace(/^["']|["']$/g, '');
if (typeof globalThis !== 'undefined' && key) {
  globalThis.VITE_CLERK_PUBLISHABLE_KEY = key;
  globalThis.CLERK_PUBLISHABLE_KEY = key;
}
