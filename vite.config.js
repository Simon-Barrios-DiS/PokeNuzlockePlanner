import os from 'node:os';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// La caché de Vite fuera de OneDrive evita bloqueos EPERM en Windows.
const cacheDir = path.join(os.tmpdir(), 'poke-biblioteca-vite');

export default defineConfig({
  plugins: [react()],
  cacheDir,
  server: {
    port: 5173,
    open: true,
  },
});
