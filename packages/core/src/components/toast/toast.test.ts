import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import { toast } from './toast.js';
import type { UfToaster } from './toast.js';

const toasts = (el: UfToaster) => [...el.shadowRoot!.querySelectorAll('[part="toast"]')];

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('uf-toaster / toast()', () => {
  it('creates a toaster on first use and shows the toast shortly after', async () => {
    toast('Saved', { variant: 'success' });
    const toaster = document.querySelector('uf-toaster')!;
    expect(toaster).not.toBeNull();
    await new Promise((r) => setTimeout(r, 150));
    await toaster.updateComplete;
    expect(toasts(toaster)).toHaveLength(1);
    expect(toaster.matches(':popover-open')).toBe(true);
  });

  it('renders title and message inside a polite live region', async () => {
    const toaster = await fixture<UfToaster>('<main><uf-toaster></uf-toaster></main>', 'uf-toaster');
    toaster.add('Your changes were saved.', { title: 'Saved' });
    await toaster.updateComplete;
    const [item] = toasts(toaster);
    expect(item.querySelector('[part="title"]')!.textContent).toBe('Saved');
    expect(toaster.shadowRoot!.querySelector('[aria-live="polite"]')).not.toBeNull();
  });

  it('announces danger toasts assertively', async () => {
    const toaster = await fixture<UfToaster>('<uf-toaster></uf-toaster>');
    toaster.add('Payment failed', { variant: 'danger' });
    await toaster.updateComplete;
    expect(toasts(toaster)[0].getAttribute('role')).toBe('alert');
  });

  it('auto-dismisses after its duration, and pauses on hover', async () => {
    vi.useFakeTimers();
    const toaster = document.body.appendChild(document.createElement('uf-toaster'));
    toaster.add('Hi', { duration: 1000 });
    await toaster.updateComplete;
    toasts(toaster)[0].dispatchEvent(new PointerEvent('pointerenter'));
    vi.advanceTimersByTime(3000);
    await toaster.updateComplete;
    expect(toasts(toaster)).toHaveLength(1);

    toasts(toaster)[0].dispatchEvent(new PointerEvent('pointerleave'));
    vi.advanceTimersByTime(1000 + 300);
    await toaster.updateComplete;
    expect(toasts(toaster)).toHaveLength(0);
  });

  it('dismisses from the close button and the handle', async () => {
    const toaster = await fixture<UfToaster>('<uf-toaster></uf-toaster>');
    toaster.add('One', { duration: 0 });
    const two = toaster.add('Two', { duration: 0 });
    await toaster.updateComplete;
    toasts(toaster)[0].querySelector<HTMLButtonElement>('[part="close-button"]')!.click();
    two.dismiss();
    await new Promise((r) => setTimeout(r, 250));
    await toaster.updateComplete;
    expect(toasts(toaster)).toHaveLength(0);
  });

  it('keeps at most five toasts', async () => {
    const toaster = await fixture<UfToaster>('<uf-toaster></uf-toaster>');
    for (let i = 0; i < 7; i++) toaster.add(`Toast ${i}`, { duration: 0 });
    await new Promise((r) => setTimeout(r, 250));
    await toaster.updateComplete;
    expect(toasts(toaster)).toHaveLength(5);
  });

  it('has no axe violations', async () => {
    const toaster = await fixture<UfToaster>('<main><uf-toaster></uf-toaster></main>', 'uf-toaster');
    toaster.add('Saved', { variant: 'success', title: 'Done' });
    toaster.add('Check your input', { variant: 'warning' });
    await toaster.updateComplete;
    expect(await axeViolations()).toEqual([]);
  });
});
