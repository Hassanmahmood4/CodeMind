/**
 * Must run before @clerk/react is loaded. Sets Clerk publishable key on globalThis
 * so Clerk's SDK can find it via getEnvVariable().
 */
const env = typeof import.meta !== 'undefined' ? import.meta.env : {};
const key = (env.VITE_CLERK_PUBLISHABLE_KEY || '').trim().replace(/^["']|["']$/g, '');
if (typeof globalThis !== 'undefined' && key) {
  globalThis.VITE_CLERK_PUBLISHABLE_KEY = key;
  globalThis.CLERK_PUBLISHABLE_KEY = key;
}
