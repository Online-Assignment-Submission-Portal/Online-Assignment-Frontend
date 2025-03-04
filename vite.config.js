// filepath: /d:/Online-Assignment-Frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // if you use environment variables, Vite expects them to be prefixed with VITE_
  envPrefix: 'VITE_',
});