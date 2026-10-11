import { create } from 'storybook/theming';

/** The documentation website. Storybook is deployed at its /storybook/ path. */
export const docsUrl = 'https://p-db.github.io/unframed-ui/';

/**
 * Storybook's own UI, matching the docs website: dark, near-black surfaces,
 * the Unframed purple, and the same system font.
 */
export const unframedTheme = create({
  base: 'dark',
  brandTitle: 'Unframed · back to the docs',
  brandUrl: docsUrl,
  brandTarget: '_self',

  colorPrimary: '#6930c3',
  colorSecondary: '#7b47cc',

  appBg: '#111312',
  appContentBg: '#0a0b08',
  appPreviewBg: '#0a0b08',
  appBorderColor: '#28262e',
  appBorderRadius: 0,

  barBg: '#111312',
  barTextColor: '#a29eae',
  barSelectedColor: '#ad8fe3',
  barHoverColor: '#cbb7ee',

  textColor: '#f7f6f9',
  textMutedColor: '#a29eae',
  textInverseColor: '#0a0b08',

  inputBg: '#19191c',
  inputBorder: '#464155',
  inputTextColor: '#f7f6f9',
  inputBorderRadius: 0,

  fontBase: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontCode: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
});
