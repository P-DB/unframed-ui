import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, settle } from '../../test-utils.js';
import './checkbox.js';
import type { UfCheckbox } from './checkbox.js';

const native = (el: UfCheckbox) => el.shadowRoot!.querySelector('input')!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-checkbox', () => {
  it('is labelled by its content', async () => {
    const el = await fixture<UfCheckbox>('<uf-checkbox>Accept terms</uf-checkbox>');
    expect(native(el).labels).toHaveLength(1);
  });

  it('is grey when disabled, not faded', async () => {
    const el = await fixture<UfCheckbox>('<div><uf-checkbox disabled>Off</uf-checkbox><uf-checkbox>On</uf-checkbox></div>');
    const [disabled, enabled] = [...el.querySelectorAll('uf-checkbox')];
    const style = (box: UfCheckbox) => getComputedStyle(box.shadowRoot!.querySelector('.root')!);
    expect(style(disabled).opacity).toBe('1');
    expect(style(disabled).color).not.toBe(style(enabled).color);
    expect(getComputedStyle(native(disabled)).backgroundColor).not.toBe(getComputedStyle(native(enabled)).backgroundColor);
  });

  it('toggles on click and emits change', async () => {
    const el = await fixture<UfCheckbox>('<uf-checkbox>Opt in</uf-checkbox>');
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    native(el).click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
    expect(el.matches(':state(checked)')).toBe(true);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('submits value only when checked', async () => {
    const form = await fixture<HTMLFormElement>(
      '<form><uf-checkbox name="a" value="yes" checked></uf-checkbox><uf-checkbox name="b"></uf-checkbox></form>',
    );
    const data = new FormData(form);
    expect(data.get('a')).toBe('yes');
    expect(data.has('b')).toBe(false);
  });

  it('clears indeterminate when clicked', async () => {
    const el = await fixture<UfCheckbox>('<uf-checkbox indeterminate>All</uf-checkbox>');
    expect(native(el).indeterminate).toBe(true);
    native(el).click();
    await el.updateComplete;
    expect(el.indeterminate).toBe(false);
    expect(el.checked).toBe(true);
  });

  it('exposes :state(indeterminate)', async () => {
    const el = await fixture<UfCheckbox>('<uf-checkbox indeterminate>Some</uf-checkbox>');
    expect(el.matches(':state(indeterminate)')).toBe(true);
    el.indeterminate = false;
    await el.updateComplete;
    expect(el.matches(':state(indeterminate)')).toBe(false);
  });

  it('is invalid when required and unchecked', async () => {
    const el = await fixture<UfCheckbox>('<uf-checkbox required>Required</uf-checkbox>');
    expect(el.validity.valueMissing).toBe(true);
    el.toggle();
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);
  });

  it('resets to its checked attribute', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-checkbox checked>x</uf-checkbox></form>');
    const el = form.querySelector('uf-checkbox')!;
    el.toggle();
    await el.updateComplete;
    expect(el.checked).toBe(false);
    form.reset();
    await settle();
    expect(el.checked).toBe(true);
  });

  it('has no axe violations', async () => {
    await fixture(`
      <main>
        <uf-checkbox>One</uf-checkbox>
        <uf-checkbox checked hint="Recommended">Two</uf-checkbox>
        <uf-checkbox indeterminate>Three</uf-checkbox>
        <uf-checkbox disabled>Four</uf-checkbox>
      </main>`);
    expect(await axeViolations()).toEqual([]);
  });
});
