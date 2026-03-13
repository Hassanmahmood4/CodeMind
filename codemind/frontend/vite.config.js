import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const publishableKey = (env.VITE_CLERK_PUBLISHABLE_KEY || '').trim().replace(/^["']|["']$/g, '');

  return {
  plugins: [
    react(),
    {
      name: 'inject-clerk-key',
      transformIndexHtml(html) {
        const script = `<script>window.VITE_CLERK_PUBLISHABLE_KEY=${JSON.stringify(publishableKey)};window.CLERK_PUBLISHABLE_KEY=${JSON.stringify(publishableKey)};</script>`;
        return html.replace('</head>', `${script}</head>`);
      },
    },
  ],
  envDir: __dirname,
  define: {
    'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(publishableKey),
  },
  optimizeDeps: { exclude: ['@clerk/react'] },
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
