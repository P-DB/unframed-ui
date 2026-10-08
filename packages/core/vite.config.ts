import { defineConfig } from 'vite';

// Dev-only playground. The library itself is built with tsc (unbundled ESM).
export default defineConfig({
  root: 'demo',
  server: { port: Number(process.env.PORT) || 5180 },
});
