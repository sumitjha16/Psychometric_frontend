import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Resolve alias for cleaner imports
  resolve: {
    alias: {
      '@': '/src', // Example: Use '@/utils/api' for '/src/utils/api.js'
    },
  },

  // Proxy to connect backend and frontend during development
  server: {
    port: 5173, // Default development server port
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Backend API URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix before forwarding to backend
      },
    },
  },

  // Optimize dependency handling
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude packages that cause issues
  },

  // Build settings for production optimization
  build: {
    target: 'esnext', // Modern JS compatibility
    outDir: 'dist', // Output folder for production build
    sourcemap: false, // Disable source maps for production builds (set to true for debugging)
  },
});
