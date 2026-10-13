import { afterEach, describe, expect, it } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import './avatar.js';
import type { UfAvatar } from './avatar.js';

const base = (el: UfAvatar) => el.shadowRoot!.querySelector<HTMLElement>('.base')!;
// A 1×1 transparent PNG, so the image loads without the network.
const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-avatar', () => {
  it('shows initials from the name, and uses the name as accessible name', async () => {
    const el = await fixture<UfAvatar>('<uf-avatar name="John Smith"></uf-avatar>');
    expect(base(el).textContent!.trim()).toBe('JS');
    expect(base(el).getAttribute('role')).toBe('img');
    expect(base(el).getAttribute('aria-label')).toBe('John Smith');
  });

  it('takes the first and last word for initials, one letter for a single word', async () => {
    const el = await fixture<UfAvatar>('<uf-avatar name="  john ronald reuel smith "></uf-avatar>');
    expect(base(el).textContent!.trim()).toBe('JS');
    el.name = 'Mario';
    await el.updateComplete;
    expect(base(el).textContent!.trim()).toBe('M');
  });

  it('uses the initials attribute over the name', async () => {
    const el = await fixture<UfAvatar>('<uf-avatar name="Unframed UI" initials="U"></uf-avatar>');
    expect(base(el).textContent!.trim()).toBe('U');
  });

  it('shows the image when it loads', async () => {
    const el = await fixture<UfAvatar>(`<uf-avatar name="John" src="${pixel}"></uf-avatar>`);
    const img = el.shadowRoot!.querySelector('img')!;
    expect(img.getAttribute('alt')).toBe('');
    expect(base(el).getAttribute('aria-label')).toBe('John');
  });

  it('falls back to the initials when the image fails, and tries again with a new src', async () => {
    const el = await fixture<UfAvatar>('<uf-avatar name="John Smith" src="data:image/png;base64,broken"></uf-avatar>');
    await new Promise((resolve) => el.shadowRoot!.querySelector('img')!.addEventListener('error', resolve, { once: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('img')).toBeNull();
    expect(base(el).textContent!.trim()).toBe('JS');

    el.src = pixel;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('img')).not.toBeNull();
  });

  it('shows an icon and is hidden from assistive tech without a name', async () => {
    const el = await fixture<UfAvatar>('<uf-avatar></uf-avatar>');
    expect(el.shadowRoot!.querySelector('svg')).not.toBeNull();
    expect(base(el).getAttribute('aria-hidden')).toBe('true');
    expect(base(el).hasAttribute('role')).toBe(false);
  });

  it('is hidden from assistive tech with decorative', async () => {
    const el = await fixture<UfAvatar>('<uf-avatar name="John" decorative></uf-avatar>');
    expect(base(el).getAttribute('aria-hidden')).toBe('true');
    expect(base(el).hasAttribute('aria-label')).toBe(false);
  });

  it('shows slotted content instead of the initials', async () => {
    const el = await fixture<UfAvatar>('<uf-avatar name="Team"><b>★</b></uf-avatar>');
    const slot = el.shadowRoot!.querySelector('slot')!;
    expect(slot.assignedElements()[0].textContent).toBe('★');
  });

  it('sizes and rounds from size and shape', async () => {
    await fixture('<div><uf-avatar size="sm"></uf-avatar><uf-avatar size="xl" shape="square"></uf-avatar></div>');
    const [sm, xl] = [...document.querySelectorAll<UfAvatar>('uf-avatar')].map(base);
    expect(sm.getBoundingClientRect().width).toBeLessThan(xl.getBoundingClientRect().width);
    expect(getComputedStyle(sm).borderRadius).toBe('50%');
    expect(getComputedStyle(xl).borderRadius).not.toBe('50%');
  });

  it('has no axe violations', async () => {
    await fixture(`<main>
      <uf-avatar name="John Smith"></uf-avatar>
      <uf-avatar name="John" src="${pixel}"></uf-avatar>
      <uf-avatar></uf-avatar>
      <span><uf-avatar name="Jane Doe" decorative></uf-avatar> Jane Doe</span>
    </main>`);
    expect(await axeViolations()).toEqual([]);
  });
});
