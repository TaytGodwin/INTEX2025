import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
    },
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " + // We kept the inline styles because we have a few
        "img-src 'self' https://cinenichebackend-fjhdf8csetdbdmbv.westus2-01.azurewebsites.net; " + // This is for the blob storage
        "frame-ancestors 'none'; " +
        "font-src 'self'; " + // ✅ No Google Fonts needed
        "connect-src 'self' https://cinenichebackend-fjhdf8csetdbdmbv.westus2-01.azurewebsites.net; " + //Api URL
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        'upgrade-insecure-requests;',
    },
  },
});
