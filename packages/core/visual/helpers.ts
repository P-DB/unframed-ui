import { afterAll, beforeAll, vi } from 'vitest';

export const themes = ['light', 'dark'] as const;
export type Theme = (typeof themes)[number];

/** Lowercase words joined by dashes, for file names. */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Every Unframed element inside `root`, at any depth, rendered. */
export async function settled(root: Element): Promise<void> {
  const elements = [...root.querySelectorAll('*')].filter((el) => el.localName.startsWith('uf-'));
  await Promise.all([...new Set(elements.map((el) => el.localName))].map((tag) => customElements.whenDefined(tag)));
  // Twice: the first update can render children that update in turn.
  for (let i = 0; i < 2; i++) {
    await Promise.all(elements.map((el) => (el as Element & { updateComplete?: Promise<unknown> }).updateComplete));
  }
  await document.fonts.ready;
}

/** A frame in `theme`, with `html` in it, as the only content of the page. */
export function frame(theme: Theme, html: string, style: string): HTMLDivElement {
  const el = document.createElement('div');
  el.dataset.ufTheme = theme;
  el.lang = 'en-US';
  el.style.cssText = `box-sizing: border-box; padding: 16px; background: var(--uf-color-surface); color: var(--uf-color-text); font-family: var(--uf-font-family-sans); ${style}`;
  el.innerHTML = html;
  document.body.replaceChildren(el);
  return el;
}

/** The same day for every run: calendars show the month of "today", and mark it. */
export function fixedToday(): void {
  beforeAll(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-15T12:00:00Z'));
    document.body.style.margin = '0';
  });
  afterAll(() => {
    vi.useRealTimers();
  });
}
