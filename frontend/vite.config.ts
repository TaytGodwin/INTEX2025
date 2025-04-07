import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Hilton's fix for deploy errors

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // This entire build block is from hilton. Keep server stuff for CORS and security
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  server: {
    port: 3030,
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
        "img-src 'self' data:; " +
        "frame-ancestors 'none'; " +
        "font-src 'self' fonts.gstatic.com data:; " +
        "connect-src 'self' https://localhost:5000; " + // ✅ Fixed URL format
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';",
    },
  },
});
