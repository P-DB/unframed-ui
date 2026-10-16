import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import './switch.js';
import type { UfSwitch } from './switch.js';

const native = (el: UfSwitch) => el.shadowRoot!.querySelector('input')!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-switch', () => {
  it('exposes role="switch" with its label', async () => {
    const el = await fixture<UfSwitch>('<uf-switch>Wi-Fi</uf-switch>');
    expect(native(el).getAttribute('role')).toBe('switch');
    expect(native(el).labels).toHaveLength(1);
  });

  it('is grey when disabled, not faded', async () => {
    const el = await fixture<UfSwitch>('<div><uf-switch disabled checked>Off</uf-switch><uf-switch checked>On</uf-switch></div>');
    const [disabled, enabled] = [...el.querySelectorAll('uf-switch')];
    expect(getComputedStyle(disabled.shadowRoot!.querySelector('.root')!).opacity).toBe('1');
    expect(getComputedStyle(native(disabled)).backgroundColor).not.toBe(getComputedStyle(native(enabled)).backgroundColor);
  });

  it('toggles and emits change', async () => {
    const el = await fixture<UfSwitch>('<uf-switch>Wi-Fi</uf-switch>');
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    native(el).click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('submits when on', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-switch name="wifi" checked></uf-switch></form>');
    expect(new FormData(form).get('wifi')).toBe('on');
  });

  it('cannot be toggled when disabled', async () => {
    const el = await fixture<UfSwitch>('<uf-switch disabled>Wi-Fi</uf-switch>');
    native(el).click();
    await el.updateComplete;
    expect(el.checked).toBe(false);
  });

  it('has no axe violations', async () => {
    await fixture('<main><uf-switch>Notifications</uf-switch><uf-switch checked>Dark mode</uf-switch></main>');
    expect(await axeViolations()).toEqual([]);
  });
});
