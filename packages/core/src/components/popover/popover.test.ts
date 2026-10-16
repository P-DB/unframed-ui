import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, nextFrame } from '../../test-utils.js';
import '../button/button.js';
import './popover.js';
import type { UfPopover } from './popover.js';

const panel = (el: UfPopover) => el.shadowRoot!.querySelector<HTMLElement>('[part="panel"]')!;

const markup = `
  <main style="padding: 40px">
    <uf-popover>
      <uf-button slot="trigger">Filters</uf-button>
      <p>Popover content</p>
    </uf-popover>
  </main>`;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-popover', () => {
  it('toggles from its trigger and reports aria-expanded', async () => {
    const el = await fixture<UfPopover>(markup, 'uf-popover');
    const trigger = el.querySelector('uf-button')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(panel(el).matches(':popover-open')).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(panel(el).matches(':popover-open')).toBe(false);
  });

  it('glows with the accent color in dark mode, where black shadows barely show', async () => {
    const shadow = async (theme: string) => {
      const el = await fixture<UfPopover>(`<uf-popover data-uf-theme="${theme}"><button slot="trigger">Open</button>Hi</uf-popover>`);
      el.show();
      await nextFrame();
      return getComputedStyle(panel(el)).boxShadow;
    };
    expect(await shadow('light')).toContain('rgba(0, 0, 0');
    expect(await shadow('dark')).not.toContain('rgba(0, 0, 0');
  });

  it('positions the panel below the trigger', async () => {
    const el = await fixture<UfPopover>(markup, 'uf-popover');
    el.show();
    await el.updateComplete;
    await nextFrame();
    const t = el.querySelector('uf-button')!.getBoundingClientRect();
    const p = panel(el).getBoundingClientRect();
    expect(p.top).toBeGreaterThanOrEqual(t.bottom);
    expect(Math.round(p.left)).toBe(Math.round(t.left));
  });

  it('syncs open when the browser light-dismisses it', async () => {
    const el = await fixture<UfPopover>(markup, 'uf-popover');
    const onHide = vi.fn();
    el.addEventListener('uf-hide', onHide);
    el.show();
    await el.updateComplete;
    panel(el).hidePopover();
    await new Promise((r) => setTimeout(r, 20));
    expect(el.open).toBe(false);
    expect(onHide).toHaveBeenCalledOnce();
  });

  it('has no axe violations when open', async () => {
    const el = await fixture<UfPopover>(markup, 'uf-popover');
    el.show();
    await el.updateComplete;
    expect(await axeViolations()).toEqual([]);
  });
});
