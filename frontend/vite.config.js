import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev proxy so the frontend can call /api/* and reach the Express backend
// without CORS headaches. In production, VITE_API_URL is used instead.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
