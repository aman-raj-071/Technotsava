import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  // The React app lives in /src; build from its own HTML shell so the
  // standalone root index.html (CDN/Babel app) is not bundled as a Vite entry.
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        main: 'src/index.html'
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          analytics: ['@vercel/analytics/react']
        }
      }
    }
  }
});
