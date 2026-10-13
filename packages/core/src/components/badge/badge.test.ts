import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import './badge.js';
import type { UfBadge } from './badge.js';

const base = (el: UfBadge) => el.shadowRoot!.querySelector<HTMLElement>('.base')!;

afterEach(() => {
  document.body.innerHTML = '';
  delete document.documentElement.dataset.ufTheme;
});

describe('uf-badge', () => {
  it('shows its text, neutral and soft by default', async () => {
    const el = await fixture<UfBadge>('<uf-badge>Draft</uf-badge>');
    expect(el.textContent).toBe('Draft');
    expect(el.getAttribute('variant')).toBe('neutral');
    expect(el.getAttribute('appearance')).toBe('soft');
  });

  it('colors each variant differently', async () => {
    await fixture('<div>' + ['neutral', 'accent', 'info', 'success', 'warning', 'danger'].map((v) => `<uf-badge variant="${v}">${v}</uf-badge>`).join('') + '</div>');
    const backgrounds = [...document.querySelectorAll<UfBadge>('uf-badge')].map((el) => getComputedStyle(base(el)).backgroundColor);
    expect(new Set(backgrounds).size).toBe(6);
  });

  it('has a transparent background and a border when outlined', async () => {
    const el = await fixture<UfBadge>('<uf-badge appearance="outline" variant="success">Paid</uf-badge>');
    const style = getComputedStyle(base(el));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderColor).toBe(style.color);
  });

  it('shows a decorative dot with dot', async () => {
    const el = await fixture<UfBadge>('<uf-badge dot variant="success">Online</uf-badge>');
    const dot = el.shadowRoot!.querySelector('.dot')!;
    expect(dot.getAttribute('aria-hidden')).toBe('true');
    el.dot = false;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.dot')).toBeNull();
  });

  it('is smaller with size="sm"', async () => {
    await fixture('<div><uf-badge size="sm">S</uf-badge><uf-badge>M</uf-badge></div>');
    const [sm, md] = [...document.querySelectorAll<UfBadge>('uf-badge')].map((el) => base(el).getBoundingClientRect().height);
    expect(sm).toBeLessThan(md);
  });

  for (const theme of ['light', 'dark']) {
    it(`has readable colors for every variant and appearance (${theme})`, async () => {
      document.documentElement.dataset.ufTheme = theme;
      const variants = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'];
      const appearances = ['soft', 'solid', 'outline'];
      await fixture(
        `<main style="background: var(--uf-color-surface); padding: 8px">${appearances
          .flatMap((a) => variants.map((v) => `<uf-badge variant="${v}" appearance="${a}">${v} ${a}</uf-badge>`))
          .join(' ')}</main>`,
      );
      expect(await axeViolations()).toEqual([]);
    });
  }
});
