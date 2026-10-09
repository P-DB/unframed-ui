import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, press, settle } from '../../test-utils.js';
import '../button/button.js';
import './tooltip.js';
import type { UfTooltip } from './tooltip.js';

const body = (el: UfTooltip) => el.shadowRoot!.querySelector<HTMLElement>('[part="body"]')!;

const markup = `
  <main>
    <uf-tooltip content="Save changes" delay="0">
      <uf-button>Save</uf-button>
    </uf-tooltip>
  </main>`;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-tooltip', () => {
  it('describes its trigger for assistive tech', async () => {
    const el = await fixture<UfTooltip>(markup, 'uf-tooltip');
    const button = el.querySelector('uf-button')!;
    await settle();
    expect(button.getAttribute('aria-description')).toBe('Save changes');
    // uf-button forwards it to the native button.
    await new Promise((r) => setTimeout(r));
    await button.updateComplete;
    expect(button.shadowRoot!.querySelector('button')!.getAttribute('aria-description')).toBe('Save changes');
  });

  it('does not repeat a label the trigger already has', async () => {
    const el = await fixture<UfTooltip>(
      '<main><uf-tooltip content="Search"><uf-button label="Search">S</uf-button></uf-tooltip></main>',
      'uf-tooltip',
    );
    await settle();
    expect(el.querySelector('uf-button')!.hasAttribute('aria-description')).toBe(false);
  });

  it('shows on focus and hides on Escape', async () => {
    const el = await fixture<UfTooltip>(markup, 'uf-tooltip');
    el.querySelector('uf-button')!.focus();
    await el.updateComplete;
    expect(body(el).matches(':popover-open')).toBe(true);
    expect(body(el).getAttribute('role')).toBe('tooltip');

    press(document, 'Escape');
    await el.updateComplete;
    expect(body(el).matches(':popover-open')).toBe(false);
  });

  it('shows on hover after the delay and hides on leave', async () => {
    const el = await fixture<UfTooltip>(markup, 'uf-tooltip');
    el.dispatchEvent(new PointerEvent('pointerenter'));
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    expect(el.open).toBe(true);
    el.dispatchEvent(new PointerEvent('pointerleave'));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('stays hidden when disabled', async () => {
    const el = await fixture<UfTooltip>(markup, 'uf-tooltip');
    el.disabled = true;
    el.show();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('has no axe violations when open', async () => {
    const el = await fixture<UfTooltip>(markup, 'uf-tooltip');
    el.show();
    await el.updateComplete;
    expect(await axeViolations()).toEqual([]);
  });
});
