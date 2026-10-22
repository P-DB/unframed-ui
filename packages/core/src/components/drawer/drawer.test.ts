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

  it('sits on the end edge by default, full height', async () => {
    const el = await fixture<UfDrawer>(markup('open'));
    await el.updateComplete;
    expect(Math.round(box(el).right)).toBe(window.innerWidth);
    expect(Math.round(box(el).height)).toBe(window.innerHeight);
    expect(box(el).width).toBeLessThan(window.innerWidth);
  });

  it('can slide in from the start, top or bottom, sized with --uf-drawer-size', async () => {
    const start = await fixture<UfDrawer>(markup('open placement="start"'));
    await start.updateComplete;
    expect(Math.round(box(start).left)).toBe(0);
    start.hide();
    await hidden(start);

    const bottom = await fixture<UfDrawer>(markup('open placement="bottom"'));
    bottom.style.setProperty('--uf-drawer-size', '200px');
    await bottom.updateComplete;
    expect(Math.round(box(bottom).bottom)).toBe(window.innerHeight);
    expect(Math.round(box(bottom).height)).toBe(200);
    expect(Math.round(box(bottom).width)).toBe(window.innerWidth);
  });

  it('rounds the corners on its open side only', async () => {
    const end = await fixture<UfDrawer>(markup('open'));
    await end.updateComplete;
    const style = getComputedStyle(native(end));
    expect(style.borderTopLeftRadius).not.toBe('0px');
    expect(style.borderTopRightRadius).toBe('0px');
    end.hide();
    await hidden(end);
    const start = await fixture<UfDrawer>(markup('open placement="start"'));
    await start.updateComplete;
    expect(getComputedStyle(native(start)).borderTopRightRadius).not.toBe('0px');
    expect(getComputedStyle(native(start)).borderTopLeftRadius).toBe('0px');
  });

  it('starts on the left edge in right-to-left pages', async () => {
    const el = await fixture<UfDrawer>(`<div dir="rtl">${markup('open')}</div>`, 'uf-drawer');
    await el.updateComplete;
    expect(Math.round(box(el).left)).toBe(0);
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
