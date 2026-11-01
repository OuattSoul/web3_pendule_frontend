import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const BACKEND = 'http://127.0.0.1:8000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: 'BACKEND_URL', // Vite only exposes VITE_* by default; nothing else reaches the browser
  server: {
    proxy: {
      '/api': BACKEND,
      '/ws': { target: BACKEND, ws: true },
    },
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
