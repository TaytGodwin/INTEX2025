import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  server: {
    port: 3030,
    // headers: {
    //   'Content-Security-Policy':
    //     "default-src 'self'; " +
    //     "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    //     "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
    //     "img-src 'self' data:; " +
    //     "frame-ancestors 'none'; " +
    //     "font-src 'self' fonts.gstatic.com data:; " +
    //     "connect-src 'self' https://localhost:5000 https://intexbackend-a6fvcvg6cha4hwcx.eastus-01.azurewebsites.net; " +
    //     "object-src 'none'; " +
    //     "base-uri 'self'; " +
    //     "form-action 'self';",
    // },
  },
});