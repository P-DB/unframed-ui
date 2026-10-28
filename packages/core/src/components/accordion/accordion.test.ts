import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, press, settle } from '../../test-utils.js';
import './accordion.js';
import type { UfAccordion } from './accordion.js';

const markup = (attrs = '') => `
  <main>
    <uf-accordion ${attrs}>
      <uf-accordion-item summary="Shipping">Ships in 2 days.</uf-accordion-item>
      <uf-accordion-item summary="Returns" open>Free returns for 30 days.</uf-accordion-item>
      <uf-accordion-item summary="Warranty" disabled>Two years.</uf-accordion-item>
      <uf-accordion-item summary="Support">Email us anytime.</uf-accordion-item>
    </uf-accordion>
  </main>`;

async function setup(attrs = '') {
  const accordion = await fixture<UfAccordion>(markup(attrs), 'uf-accordion');
  await settle();
  const items = [...accordion.querySelectorAll('uf-accordion-item')];
  const details = (i: number) => items[i].shadowRoot!.querySelector('details')!;
  const toggled = () => new Promise((r) => setTimeout(r, 30));
  return { accordion, items, details, toggled };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-accordion', () => {
  it('renders items on native details, honouring open', async () => {
    const { details } = await setup();
    expect(details(0).open).toBe(false);
    expect(details(1).open).toBe(true);
  });

  it('opens on header click and emits uf-show', async () => {
    const { items, toggled } = await setup('multiple');
    const onShow = vi.fn();
    items[0].addEventListener('uf-show', onShow);
    items[0].header!.click();
    await toggled();
    expect(items[0].open).toBe(true);
    expect(onShow).toHaveBeenCalledOnce();
  });

  it('closes the other items unless multiple is set', async () => {
    const single = await setup();
    single.items[0].header!.click();
    await single.toggled();
    expect(single.items.map((i) => i.open)).toEqual([true, false, false, false]);

    const multi = await setup('multiple');
    multi.items[0].header!.click();
    await multi.toggled();
    expect(multi.items.map((i) => i.open)).toEqual([true, true, false, false]);
  });

  it('does not toggle a disabled item', async () => {
    const { items, toggled } = await setup();
    items[2].header!.click();
    await toggled();
    expect(items[2].open).toBe(false);
  });

  it('does not announce items that start open', async () => {
    const onShow = vi.fn();
    document.addEventListener('uf-show', onShow, { capture: true });
    await setup();
    await new Promise((r) => setTimeout(r, 30));
    document.removeEventListener('uf-show', onShow, { capture: true });
    expect(onShow).not.toHaveBeenCalled();
  });

  it('moves between headers with arrow keys, skipping disabled items', async () => {
    const { items } = await setup();
    items[1].focus();
    press(items[1].header!, 'ArrowDown');
    expect(items[3].shadowRoot!.activeElement).toBe(items[3].header);
    press(items[3].header!, 'ArrowDown');
    expect(items[0].shadowRoot!.activeElement).toBe(items[0].header);
    press(items[0].header!, 'End');
    expect(items[3].shadowRoot!.activeElement).toBe(items[3].header);
  });

  it('opens programmatically', async () => {
    const { items, details } = await setup('multiple');
    items[3].show();
    await items[3].updateComplete;
    expect(details(3).open).toBe(true);
  });

  it('has no axe violations', async () => {
    await setup();
    expect(await axeViolations()).toEqual([]);
  });
});
