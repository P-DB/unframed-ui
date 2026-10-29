import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, settle } from '../../test-utils.js';
import { setTranslations } from '../../internal/i18n.js';
import './number-input.js';
import type { UfNumberInput } from './number-input.js';

const native = (el: UfNumberInput) => el.shadowRoot!.querySelector('input')!;
const button = (el: UfNumberInput, part: 'decrement' | 'increment') =>
  el.shadowRoot!.querySelector<HTMLButtonElement>(`[part="${part}"]`)!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-number-input', () => {
  it('is a labelled number field, empty and null by default', async () => {
    const el = await fixture<UfNumberInput>('<uf-number-input label="Guests"></uf-number-input>');
    expect(native(el).type).toBe('number');
    expect(native(el).labels?.[0]?.textContent?.trim()).toBe('Guests');
    expect(el.value).toBeNull();
  });

  it('takes a number from the value attribute and submits it', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-number-input name="guests" value="3"></uf-number-input></form>');
    const el = form.querySelector('uf-number-input')!;
    expect(el.value).toBe(3);
    expect(native(el).value).toBe('3');
    expect(new FormData(form).get('guests')).toBe('3');
  });

  it('steps with the buttons, within min and max, and emits input and change', async () => {
    const el = await fixture<UfNumberInput>('<uf-number-input value="1" min="0" max="2"></uf-number-input>');
    const onInput = vi.fn();
    const onChange = vi.fn();
    el.addEventListener('input', onInput);
    el.addEventListener('change', onChange);

    button(el, 'increment').click();
    await el.updateComplete;
    expect(el.value).toBe(2);
    expect(onInput).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledOnce();
    expect(button(el, 'increment').disabled).toBe(true);

    button(el, 'decrement').click();
    button(el, 'decrement').click();
    await el.updateComplete;
    expect(el.value).toBe(0);
    expect(button(el, 'decrement').disabled).toBe(true);
  });

  it('steps by step, and with stepUp() and stepDown()', async () => {
    const el = await fixture<UfNumberInput>('<uf-number-input value="0.5" step="0.25"></uf-number-input>');
    el.stepUp();
    expect(el.value).toBe(0.75);
    el.stepDown(3);
    expect(el.value).toBe(0);
  });

  it('keeps the text as typed, and is null when emptied', async () => {
    const el = await fixture<UfNumberInput>('<uf-number-input></uf-number-input>');
    await userEvent.type(native(el), '1.50');
    await el.updateComplete;
    expect(el.value).toBe(1.5);
    expect(native(el).value).toBe('1.50');
    await userEvent.clear(native(el));
    await el.updateComplete;
    expect(el.value).toBeNull();
  });

  it('shows a value set from code', async () => {
    const el = await fixture<UfNumberInput>('<uf-number-input></uf-number-input>');
    el.value = 42;
    await el.updateComplete;
    expect(native(el).value).toBe('42');
    el.value = null;
    await el.updateComplete;
    expect(native(el).value).toBe('');
  });

  it('validates required, min and max', async () => {
    const el = await fixture<UfNumberInput>('<uf-number-input required min="1" max="10"></uf-number-input>');
    expect(el.validity.valueMissing).toBe(true);
    el.value = 20;
    expect(el.validity.rangeOverflow).toBe(true);
    el.value = 5;
    expect(el.checkValidity()).toBe(true);
  });

  it('resets to its initial value with the form', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-number-input value="2"></uf-number-input></form>');
    const el = form.querySelector('uf-number-input')!;
    el.stepUp();
    expect(el.value).toBe(3);
    form.reset();
    await settle();
    expect(el.value).toBe(2);
  });

  it("doesn't step when disabled or read-only", async () => {
    const el = await fixture<UfNumberInput>('<uf-number-input value="1" readonly></uf-number-input>');
    expect(button(el, 'increment').disabled).toBe(true);
    el.stepUp();
    expect(el.value).toBe(1);
  });

  it('keeps its buttons out of the tab order, named and translated', async () => {
    setTranslations({ increase: 'Aumenta', decrease: 'Diminuisci' }, 'it');
    const el = await fixture<UfNumberInput>('<div lang="it"><uf-number-input label="Ospiti"></uf-number-input></div>', 'uf-number-input');
    expect(button(el, 'increment').tabIndex).toBe(-1);
    expect(button(el, 'increment').getAttribute('aria-label')).toBe('Aumenta');
    expect(button(el, 'decrement').getAttribute('aria-label')).toBe('Diminuisci');
  });

  it('has no axe violations', async () => {
    await fixture('<main><uf-number-input label="Guests" value="2" min="1" hint="Up to 10"></uf-number-input></main>');
    expect(await axeViolations()).toEqual([]);
  });
});
