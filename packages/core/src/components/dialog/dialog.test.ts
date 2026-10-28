import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import '../button/button.js';
import '../popover/popover.js';
import './dialog.js';
import type { UfDialog } from './dialog.js';

const native = (el: UfDialog) => el.shadowRoot!.querySelector('dialog')!;

/** Resolves once the exit animation finished and the dialog actually closed. */
const hidden = (el: UfDialog) => new Promise((resolve) => el.addEventListener('uf-hide', resolve, { once: true }));

const markup = (attrs = '') => `
  <uf-dialog label="Delete project" ${attrs}>
    <p>This can't be undone.</p>
    <uf-button slot="footer" variant="ghost" data-dialog="close">Cancel</uf-button>
    <uf-button slot="footer" variant="danger">Delete</uf-button>
  </uf-dialog>`;

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.style.overflow = '';
});

describe('uf-dialog', () => {
  it('opens modally and emits uf-show', async () => {
    const el = await fixture<UfDialog>(markup());
    const onShow = vi.fn();
    el.addEventListener('uf-show', onShow);
    el.show();
    await el.updateComplete;
    expect(native(el).open).toBe(true);
    expect(native(el).matches(':modal')).toBe(true);
    expect(onShow).toHaveBeenCalledOnce();
  });

  it('is named by its label', async () => {
    const el = await fixture<UfDialog>(markup('open'));
    const titleId = native(el).getAttribute('aria-labelledby')!;
    expect(el.shadowRoot!.getElementById(titleId)!.textContent?.trim()).toBe('Delete project');
  });

  it('closes from the close button and emits uf-hide', async () => {
    const el = await fixture<UfDialog>(markup('open'));
    const onHide = vi.fn();
    el.addEventListener('uf-hide', onHide);
    const done = hidden(el);
    el.shadowRoot!.querySelector<HTMLButtonElement>('[part="close-button"]')!.click();
    expect(el.open).toBe(false);
    await done;
    expect(native(el).open).toBe(false);
    expect(onHide).toHaveBeenCalledOnce();
  });

  it('closes from elements with data-dialog="close"', async () => {
    const el = await fixture<UfDialog>(markup('open'));
    el.querySelector<HTMLElement>('[data-dialog="close"]')!.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('closes on Escape, unless uf-request-close is cancelled', async () => {
    const el = await fixture<UfDialog>(markup('open'));
    const keep = (e: Event) => e.preventDefault();
    el.addEventListener('uf-request-close', keep);
    native(el).dispatchEvent(new Event('cancel', { cancelable: true }));
    await el.updateComplete;
    expect(el.open).toBe(true);

    el.removeEventListener('uf-request-close', keep);
    native(el).dispatchEvent(new Event('cancel', { cancelable: true }));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('only closes on backdrop click with light-dismiss', async () => {
    const el = await fixture<UfDialog>(markup('open'));
    native(el).click();
    await el.updateComplete;
    expect(el.open).toBe(true);

    el.lightDismiss = true;
    native(el).click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('locks page scroll until the exit animation ends', async () => {
    const el = await fixture<UfDialog>(markup('open'));
    expect(document.documentElement.style.overflow).toBe('hidden');
    const done = hidden(el);
    el.hide();
    await el.updateComplete;
    expect(document.documentElement.style.overflow).toBe('hidden');
    await done;
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('stays modal, in place, while the exit animation runs', async () => {
    const el = await fixture<UfDialog>(markup('open'));
    const part = (name: string) => el.shadowRoot!.querySelector(`[part="${name}"]`)!.getBoundingClientRect();
    const before = { dialog: part('dialog'), body: part('body'), footer: part('footer') };
    el.hide();
    await el.updateComplete;
    expect(native(el).matches(':modal')).toBe(true);
    expect(native(el).classList.contains('closing')).toBe(true);
    // It slides down slightly as it fades, so compare positions relative to the dialog.
    expect(part('dialog').left).toBe(before.dialog.left);
    expect(part('body').width).toBe(before.body.width);
    expect(part('footer').top - part('dialog').top).toBe(before.footer.top - before.dialog.top);
  });

  it("doesn't announce the show and hide of popups inside it", async () => {
    const el = await fixture<UfDialog>(`
      <uf-dialog label="Share" open>
        <uf-popover><uf-button slot="trigger">More</uf-button><p>Options</p></uf-popover>
      </uf-dialog>`);
    const onToggle = vi.fn();
    el.addEventListener('uf-show', onToggle);
    el.addEventListener('uf-hide', onToggle);
    const popover = el.querySelector('uf-popover')!;
    const onPopoverHide = vi.fn();
    popover.addEventListener('uf-hide', onPopoverHide);
    popover.show();
    await popover.updateComplete;
    popover.hide();
    // The panel's toggle event, which announces uf-hide, is async.
    await new Promise((r) => setTimeout(r, 20));
    expect(onPopoverHide).toHaveBeenCalledOnce();
    expect(el.open).toBe(true);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('can be reopened during the exit animation', async () => {
    const el = await fixture<UfDialog>(markup('open'));
    const onHide = vi.fn();
    el.addEventListener('uf-hide', onHide);
    el.hide();
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 400));
    expect(native(el).open).toBe(true);
    expect(native(el).classList.contains('closing')).toBe(false);
    expect(onHide).not.toHaveBeenCalled();
  });

  it('restores the page styles it changed for the scroll lock', async () => {
    document.documentElement.style.overflow = 'clip';
    const el = await fixture<UfDialog>(markup('open'));
    expect(document.documentElement.style.overflow).toBe('hidden');
    const done = hidden(el);
    el.hide();
    await done;
    expect(document.documentElement.style.overflow).toBe('clip');
    expect(document.documentElement.style.getPropertyValue('--uf-scrollbar-width')).toBe('');
  });

  it('has no axe violations when open', async () => {
    await fixture(`<main>${markup('open')}</main>`);
    expect(await axeViolations()).toEqual([]);
  });
});
