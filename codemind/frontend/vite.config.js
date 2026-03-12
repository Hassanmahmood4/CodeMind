import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Load env so VITE_CLERK_PUBLISHABLE_KEY is available to the client (and to define below)
  const env = loadEnv(mode, __dirname, '');
  const publishableKey = env.VITE_CLERK_PUBLISHABLE_KEY || '';

  return {
  plugins: [react()],
  envDir: __dirname,
  define: {
    'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(publishableKey),
  },
  // Don't pre-bundle Clerk so it sees the same import.meta.env as our app
  optimizeDeps: {
    exclude: ['@clerk/react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  };
});
