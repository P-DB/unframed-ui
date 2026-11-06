import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import '../button/button.js';
import './drawer.js';
import type { UfDrawer } from './drawer.js';

const native = (el: UfDrawer) => el.shadowRoot!.querySelector('dialog')!;
const hidden = (el: UfDrawer) => new Promise((resolve) => el.addEventListener('uf-hide', resolve, { once: true }));
const box = (el: UfDrawer) => native(el).getBoundingClientRect();

const markup = (attrs = '') => `
  <uf-drawer label="Filters" style="--uf-duration-base: 0s" ${attrs}>
    <p>Pick filters.</p>
    <uf-button slot="footer" data-dialog="close">Done</uf-button>
  </uf-drawer>`;

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.style.overflow = '';
});

describe('uf-drawer', () => {
  it('opens modally, named by its label, and fires uf-show', async () => {
    const el = await fixture<UfDrawer>(markup());
    const onShow = vi.fn();
    el.addEventListener('uf-show', onShow);
    el.show();
    await el.updateComplete;
    expect(native(el).matches(':modal')).toBe(true);
    expect(el.shadowRoot!.getElementById(native(el).getAttribute('aria-labelledby')!)!.textContent!.trim()).toBe('Filters');
    expect(onShow).toHaveBeenCalledOnce();
  });

  it('floats near the end edge by default, a gap away from the screen edges', async () => {
    const el = await fixture<UfDrawer>(markup('open'));
    el.style.setProperty('--uf-drawer-gap', '12px');
    await el.updateComplete;
    expect(Math.round(box(el).right)).toBe(window.innerWidth - 12);
    expect(Math.round(box(el).top)).toBe(12);
    expect(Math.round(box(el).height)).toBe(window.innerHeight - 24);
    expect(box(el).width).toBeLessThan(window.innerWidth);
  });

  it('can slide in from the start, top or bottom, sized with --uf-drawer-size', async () => {
    const start = await fixture<UfDrawer>(markup('open placement="start"'));
    start.style.setProperty('--uf-drawer-gap', '12px');
    await start.updateComplete;
    expect(Math.round(box(start).left)).toBe(12);
    start.hide();
    await hidden(start);

    const bottom = await fixture<UfDrawer>(markup('open placement="bottom"'));
    bottom.style.setProperty('--uf-drawer-size', '200px');
    bottom.style.setProperty('--uf-drawer-gap', '12px');
    await bottom.updateComplete;
    expect(Math.round(box(bottom).bottom)).toBe(window.innerHeight - 12);
    expect(Math.round(box(bottom).height)).toBe(200);
    expect(Math.round(box(bottom).width)).toBe(window.innerWidth - 24);
  });

  it('sits against the edge with --uf-drawer-gap: 0', async () => {
    const el = await fixture<UfDrawer>(markup('open'));
    el.style.setProperty('--uf-drawer-gap', '0px');
    await el.updateComplete;
    expect(Math.round(box(el).right)).toBe(window.innerWidth);
    expect(Math.round(box(el).height)).toBe(window.innerHeight);
  });

  it('rounds every corner, with --uf-drawer-radius', async () => {
    const el = await fixture<UfDrawer>(markup('open'));
    el.style.setProperty('--uf-drawer-radius', '10px');
    await el.updateComplete;
    const style = getComputedStyle(native(el));
    expect([style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius]).toEqual(['10px', '10px', '10px', '10px']);
  });

  it('starts near the left edge in right-to-left pages', async () => {
    const el = await fixture<UfDrawer>(`<div dir="rtl">${markup('open')}</div>`, 'uf-drawer');
    el.style.setProperty('--uf-drawer-gap', '12px');
    await el.updateComplete;
    expect(Math.round(box(el).left)).toBe(12);
  });

  it('closes with Escape and data-dialog="close", like a dialog', async () => {
    const el = await fixture<UfDrawer>(markup('open'));
    await el.updateComplete;
    let closed = hidden(el);
    await userEvent.keyboard('{Escape}');
    await closed;
    expect(el.open).toBe(false);
    el.show();
    await el.updateComplete;
    closed = hidden(el);
    el.querySelector<HTMLElement>('[data-dialog="close"]')!.click();
    await closed;
    expect(native(el).open).toBe(false);
  });

  it('has no axe violations when open', async () => {
    const el = await fixture<UfDrawer>(`<main>${markup()}</main>`, 'uf-drawer');
    el.show();
    await el.updateComplete;
    expect(await axeViolations()).toEqual([]);
  });
});
