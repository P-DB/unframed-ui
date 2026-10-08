import { afterEach, describe, expect, it } from 'vitest';
import { fixture } from '../../test-utils.js';
import { registerIcons } from './icon.js';
import type { UfIcon } from './icon.js';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-icon', () => {
  it('renders a built-in icon, hidden from assistive tech by default', async () => {
    const el = await fixture<UfIcon>('<uf-icon name="check"></uf-icon>');
    expect(el.shadowRoot!.querySelector('svg')).not.toBeNull();
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('becomes an image with a label', async () => {
    const el = await fixture<UfIcon>('<uf-icon name="info" label="Information"></uf-icon>');
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Information');
    expect(el.hasAttribute('aria-hidden')).toBe(false);
  });

  it('renders registered icons, including ones registered after render', async () => {
    const el = await fixture<UfIcon>('<uf-icon name="dot"></uf-icon>');
    expect(el.shadowRoot!.querySelector('svg')).toBeNull();
    registerIcons({ dot: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg>' });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('circle')).not.toBeNull();
  });
});
