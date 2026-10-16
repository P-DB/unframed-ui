import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const packages = fileURLToPath(new URL('../../packages', import.meta.url));

export default defineConfig({
  // GitHub Pages serves the site from /unframed-ui/ (set by the deploy workflow).
  base: process.env.WEBSITE_BASE || '/',
  plugins: [react()],
  resolve: {
    // Use the sources directly, so component edits show up without rebuilding the packages.
    alias: [
      { find: /^@unframed\/core$/, replacement: `${packages}/core/src/index.ts` },
      { find: /^@unframed\/core\/([\w-]+)$/, replacement: `${packages}/core/src/components/$1/$1.ts` },
      { find: /^@unframed\/core\/locales\/([\w-]+)$/, replacement: `${packages}/core/src/locales/$1.ts` },
      { find: /^@unframed\/react$/, replacement: `${packages}/react/src/index.ts` },
    ],
  },
  server: { port: Number(process.env.PORT) || 5190 },
});
