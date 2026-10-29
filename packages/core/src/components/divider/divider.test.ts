import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import './divider.js';
import type { UfDivider } from './divider.js';

const base = (el: UfDivider) => el.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-divider', () => {
  it('is a horizontal separator by default', async () => {
    const el = await fixture<UfDivider>('<uf-divider></uf-divider>');
    expect(base(el).getAttribute('role')).toBe('separator');
    expect(base(el).getAttribute('aria-orientation')).toBe('horizontal');
    expect(el.getBoundingClientRect().width).toBeGreaterThan(0);
  });

  it('can be vertical, between items in a row', async () => {
    const row = await fixture<HTMLElement>('<div style="display: flex; height: 2rem"><span>A</span><uf-divider orientation="vertical"></uf-divider><span>B</span></div>');
    const el = row.querySelector<UfDivider>('uf-divider')!;
    expect(base(el).getAttribute('aria-orientation')).toBe('vertical');
    expect(el.getBoundingClientRect().height).toBeGreaterThan(20);
  });

  it('reads a label as text, with the line around it decorative', async () => {
    const el = await fixture<UfDivider>('<uf-divider>or</uf-divider>');
    expect(base(el).hasAttribute('role')).toBe(false);
    expect(el.shadowRoot!.querySelector('[part="label"]')).not.toBeNull();
    expect([...el.shadowRoot!.querySelectorAll('.line')].every((l) => l.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('switches to a label when one is added', async () => {
    const el = await fixture<UfDivider>('<uf-divider></uf-divider>');
    el.append('or');
    await new Promise((r) => setTimeout(r));
    await el.updateComplete;
    expect(base(el).hasAttribute('role')).toBe(false);
  });

  it('has no axe violations', async () => {
    await fixture('<main><p>A</p><uf-divider></uf-divider><p>B</p><uf-divider>or</uf-divider><p>C</p></main>');
    expect(await axeViolations()).toEqual([]);
  });
});
