import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import examples from 'virtual:examples';
import '@unframed/tokens/tokens.css';
import '../src/index.js';

/** Lowercase words joined by dashes, for file names. */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Every Unframed element inside `root`, at any depth, rendered. */
async function settled(root: Element): Promise<void> {
  const elements = [...root.querySelectorAll('*')].filter((el) => el.localName.startsWith('uf-'));
  await Promise.all([...new Set(elements.map((el) => el.localName))].map((tag) => customElements.whenDefined(tag)));
  // Twice: the first update can render children that update in turn.
  for (let i = 0; i < 2; i++) {
    await Promise.all(elements.map((el) => (el as Element & { updateComplete?: Promise<unknown> }).updateComplete));
  }
  await document.fonts.ready;
}

beforeAll(() => {
  // Calendars show the month of "today", and mark it: a fixed day keeps them the same.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-15T12:00:00Z'));
  document.body.style.margin = '0';
});

afterAll(() => {
  vi.useRealTimers();
});

// Each example of each component page, as the docs show it, in both themes. Scripts are left
// out: they add behavior (listeners, toasts), not what the example looks like at first.
for (const component of examples) {
  describe(component.slug, () => {
    for (const example of component.examples) {
      for (const theme of ['light', 'dark'] as const) {
        it(`${example.title} (${theme})`, async () => {
          const frame = document.createElement('div');
          frame.dataset.ufTheme = theme;
          frame.lang = 'en-US';
          frame.style.cssText =
            'display: flow-root; width: 640px; padding: 16px; box-sizing: border-box; background: var(--uf-color-surface); color: var(--uf-color-text); font-family: var(--uf-font-family-sans)';
          frame.innerHTML = example.html.replace(/<script[\s\S]*?<\/script>/g, '');
          document.body.replaceChildren(frame);
          await settled(frame);
          await expect.element(page.elementLocator(frame)).toMatchScreenshot(`${component.slug}--${slugify(example.title)}--${theme}`);
        });
      }
    }
  });
}
