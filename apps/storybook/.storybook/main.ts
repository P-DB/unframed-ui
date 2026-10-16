import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/web-components-vite';

const coreSrc = fileURLToPath(new URL('../../../packages/core/src', import.meta.url));

const config: StorybookConfig = {
  framework: '@storybook/web-components-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  async viteFinal(viteConfig) {
    // Use the component sources directly, so edits show up without rebuilding @unframed/core.
    const alias = [
      { find: /^@unframed\/core$/, replacement: `${coreSrc}/index.ts` },
      { find: /^@unframed\/core\/([\w-]+)$/, replacement: `${coreSrc}/components/$1/$1.ts` },
      { find: /^@unframed\/core\/locales\/([\w-]+)$/, replacement: `${coreSrc}/locales/$1.ts` },
    ];
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = [...(Array.isArray(viteConfig.resolve.alias) ? viteConfig.resolve.alias : []), ...alias];
    return viteConfig;
  },
};

export default config;
