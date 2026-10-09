import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    // The end-to-end tests type-check a whole generated project.
    testTimeout: 120_000,
  },
});
