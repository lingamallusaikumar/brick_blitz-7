import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    target: 'es2020'
  },
  server: {
    port: 3000,
    open: false,
    host: true
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.js']
  }
});
