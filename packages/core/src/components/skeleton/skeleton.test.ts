import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import './skeleton.js';
import type { UfSkeleton } from './skeleton.js';

const lines = (el: UfSkeleton) => [...el.shadowRoot!.querySelectorAll<HTMLElement>('[part="line"]')];

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-skeleton', () => {
  it('is one line of text by default, hidden from assistive tech', async () => {
    const el = await fixture<UfSkeleton>('<uf-skeleton></uf-skeleton>');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(lines(el)).toHaveLength(1);
    expect(lines(el)[0].getBoundingClientRect().height).toBeGreaterThan(0);
  });

  it('shows several lines, the last one shorter', async () => {
    const el = await fixture<UfSkeleton>('<uf-skeleton lines="3" style="width: 300px"></uf-skeleton>');
    const [first, , last] = lines(el);
    expect(lines(el)).toHaveLength(3);
    expect(last.getBoundingClientRect().width).toBeLessThan(first.getBoundingClientRect().width);
  });

  it('is a block or a circle, sized with CSS', async () => {
    const rect = await fixture<UfSkeleton>('<uf-skeleton shape="rect" style="width: 200px; height: 120px"></uf-skeleton>');
    expect(rect.getBoundingClientRect().height).toBe(120);
    const circle = await fixture<UfSkeleton>('<uf-skeleton shape="circle"></uf-skeleton>');
    const block = circle.shadowRoot!.querySelector<HTMLElement>('.block')!;
    expect(getComputedStyle(block).borderRadius).toBe('50%');
    const box = circle.getBoundingClientRect();
    expect(box.width).toBe(box.height);
  });

  it('has no axe violations inside a busy region', async () => {
    await fixture('<main><section aria-busy="true" aria-label="Profile"><uf-skeleton shape="circle"></uf-skeleton><uf-skeleton lines="2"></uf-skeleton></section></main>');
    expect(await axeViolations()).toEqual([]);
  });
});
