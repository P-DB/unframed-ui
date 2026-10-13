import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@unframed\/core$/, replacement: `${coreSrc}/index.ts` },
      { find: /^@unframed\/core\/([\w-]+)$/, replacement: `${coreSrc}/components/$1/$1.ts` },
    ],
  },
  optimizeDeps: {
    include: ['@angular/core', '@angular/compiler', '@angular/common', '@angular/forms', '@angular/platform-browser', 'rxjs',
      'lit', 'lit/directives/class-map.js', 'lit/directives/if-defined.js', 'lit/directives/live.js', 'lit/directives/repeat.js', 'lit/directives/style-map.js',
      'lit/directives/unsafe-svg.js'],
  },
  test: {
    include: ['test/**/*.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
