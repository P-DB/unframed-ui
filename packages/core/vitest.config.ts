import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  // Pre-bundle up front; discovering these mid-run reloads the browser and fails imports.
  optimizeDeps: {
    include: ['lit', 'lit/directives/class-map.js', 'lit/directives/if-defined.js', 'lit/directives/live.js',
      'lit/directives/repeat.js', 'lit/directives/style-map.js', 'lit/directives/unsafe-svg.js', 'axe-core'],
  },
  test: {
    include: ['src/**/*.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
