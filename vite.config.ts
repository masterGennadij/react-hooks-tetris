import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/react-hooks-tetris/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
