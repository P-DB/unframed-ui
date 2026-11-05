import { join } from 'node:path';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, type Plugin } from 'vitest/config';
// @ts-expect-error: a plain .mjs module, shared with the docs for AI assistants.
import { componentPages } from '../../scripts/docs-markdown.mjs';

/**
 * Every example of the docs site (apps/website/src/demos.tsx) as `virtual:examples`:
 * the screenshots cover what users see in the docs, with nothing to keep in sync.
 */
function examples(): Plugin {
  const id = 'virtual:examples';
  return {
    name: 'unframed-examples',
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    load: (resolved) => (resolved === `\0${id}` ? `export default ${JSON.stringify(componentPages())};` : undefined),
  };
}

// Screenshots of the docs examples in light and dark, compared with the committed ones.
// Separate from `npm test`: the references are taken on Linux in CI, where fonts are fixed.
// `npm run test:visual` compares; `npm run test:visual -- -u` updates the references.
export default defineConfig({
  plugins: [examples()],
  optimizeDeps: {
    include: ['lit', 'lit/directives/class-map.js', 'lit/directives/if-defined.js', 'lit/directives/live.js',
      'lit/directives/repeat.js', 'lit/directives/style-map.js', 'lit/directives/unsafe-svg.js'],
  },
  test: {
    include: ['visual/**/*.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      // Animations (spinner, skeleton, indeterminate progress) stop, so screenshots are stable.
      provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
      instances: [{ browser: 'chromium' }],
      viewport: { width: 800, height: 600 },
      expect: {
        toMatchScreenshot: {
          comparatorName: 'pixelmatch',
          // A few pixels, not a share of the image: a share of a full-page screenshot is hundreds
          // of pixels, more than a rounded corner on a small button changes (about 80). Edge
          // anti-aliasing is ignored (includeAA: false), so text rendering doesn't count.
          comparatorOptions: { allowedMismatchedPixels: 10 },
          // Next to the test, not in the ignored __screenshots__ folder. Only the Linux ones are
          // committed; on a Mac, the first run takes local references for before/after checks.
          resolveScreenshotPath: ({ arg, browserName, platform, ext, testFileDirectory, root }) =>
            join(root, testFileDirectory, 'screenshots', `${arg}-${browserName}-${platform}${ext}`),
        },
      },
    },
  },
});
