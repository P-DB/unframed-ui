import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import examples from 'virtual:examples';
import '@unframed/tokens/tokens.css';
import '../src/index.js';
import { fixedToday, frame, settled, slugify, themes } from './helpers.js';

fixedToday();

// Each example of each component page, as the docs show it, in both themes. Scripts are left
// out: they add behavior (listeners, toasts), not what the example looks like at first.
// states.test.ts covers what they add.
for (const component of examples) {
  describe(component.slug, () => {
    for (const example of component.examples) {
      for (const theme of themes) {
        it(`${example.title} (${theme})`, async () => {
          const el = frame(theme, example.html.replace(/<script[\s\S]*?<\/script>/g, ''), 'display: flow-root; width: 640px');
          await settled(el);
          await expect.element(page.elementLocator(el)).toMatchScreenshot(`${component.slug}--${slugify(example.title)}--${theme}`);
        });
      }
    }
  });
}
