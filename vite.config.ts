import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  define: {
    __BASE_PATH__: JSON.stringify('/'),
    'process.env': {},
    'process.version': JSON.stringify('v18.0.0'),
    'process.browser': true,
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      'buffer',
      'stream-browserify',
      'util',
      'readable-stream',
      'hash-base',
      'md5.js',
      'create-hash',
      'create-hmac',
      'ed25519-hd-key',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-crypto': ['buffer', 'stream-browserify', 'util'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
});
