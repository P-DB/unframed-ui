import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const coreSrc = fileURLToPath(new URL('../core/src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      // The full build compiles template strings, so tests can use real v-model syntax.
      { find: /^vue$/, replacement: 'vue/dist/vue.esm-bundler.js' },
      { find: /^@unframed\/core$/, replacement: `${coreSrc}/index.ts` },
      { find: /^@unframed\/core\/([\w-]+)$/, replacement: `${coreSrc}/components/$1/$1.ts` },
    ],
  },
  define: { __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false },
  optimizeDeps: {
    include: ['vue/dist/vue.esm-bundler.js', 'lit', 'lit/directives/class-map.js', 'lit/directives/if-defined.js',
      'lit/directives/live.js', 'lit/directives/repeat.js', 'lit/directives/style-map.js', 'lit/directives/unsafe-svg.js'],
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
