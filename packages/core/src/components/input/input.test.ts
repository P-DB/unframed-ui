import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import { axeViolations, commit, fixture, settle, typeInto } from '../../test-utils.js';
import './input.js';
import type { UfInput } from './input.js';

const native = (el: UfInput) => el.shadowRoot!.querySelector('input')!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-input', () => {
  it('labels the native input', async () => {
    const el = await fixture<UfInput>('<uf-input label="Email"></uf-input>');
    expect(native(el).labels?.[0]?.textContent?.trim()).toBe('Email');
  });

  it("doesn't change its border on hover when disabled", async () => {
    const el = await fixture<UfInput>('<uf-input label="Name" disabled style="--uf-duration-fast: 0s"></uf-input>');
    const box = el.shadowRoot!.querySelector('.box')!;
    const before = getComputedStyle(box).borderColor;
    await userEvent.hover(box);
    expect(getComputedStyle(box).borderColor).toBe(before);
    await userEvent.unhover(box);
  });

  it('is grey when disabled, not faded', async () => {
    const el = await fixture<UfInput>('<uf-input label="Name" disabled></uf-input><uf-input label="Name"></uf-input>');
    const [disabled, enabled] = [...document.querySelectorAll('uf-input')].map((e) => getComputedStyle(e.shadowRoot!.querySelector('.box')!));
    expect(disabled.opacity).toBe('1');
    expect(disabled.backgroundColor).not.toBe(enabled.backgroundColor);
    expect(disabled.color).not.toBe(enabled.color);
    expect(el.disabled).toBe(true);
  });

  it('takes its initial value from the value attribute', async () => {
    const el = await fixture<UfInput>('<uf-input value="hello"></uf-input>');
    expect(el.value).toBe('hello');
    expect(native(el).value).toBe('hello');
  });

  it('updates value and re-emits input and change from the host', async () => {
    const el = await fixture<UfInput>('<uf-input></uf-input>');
    const onInput = vi.fn();
    const onChange = vi.fn();
    el.addEventListener('input', onInput);
    el.addEventListener('change', onChange);
    typeInto(native(el), 'abc');
    commit(native(el));
    expect(el.value).toBe('abc');
    expect(onInput).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('submits its value with the form', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-input name="q" value="cats"></uf-input></form>');
    expect(new FormData(form).get('q')).toBe('cats');
  });

  it('blocks submission when required and empty, then shows the error', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-input name="q" label="Query" required></uf-input></form>');
    const el = form.querySelector('uf-input')!;
    expect(el.checkValidity()).toBe(false);
    expect(el.validity.valueMissing).toBe(true);
    // Pristine fields don't show an error yet.
    expect(el.matches(':state(user-invalid)')).toBe(false);

    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', onSubmit);
    form.requestSubmit();
    await settle();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(el.matches(':state(user-invalid)')).toBe(true);
    expect(native(el).getAttribute('aria-invalid')).toBe('true');
    expect(el.shadowRoot!.querySelector('[part="error"]')!.textContent).not.toBe('');
  });

  it('validates type, length and custom errors', async () => {
    const el = await fixture<UfInput>('<uf-input type="email" value="nope"></uf-input>');
    expect(el.validity.typeMismatch).toBe(true);

    el.value = 'a@b.co';
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);

    el.setCustomValidity('Taken');
    expect(el.validity.customError).toBe(true);
    expect(el.validationMessage).toBe('Taken');
    el.setCustomValidity('');
    expect(el.checkValidity()).toBe(true);
  });

  it('resets to its initial value with the form', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-input value="start"></uf-input></form>');
    const el = form.querySelector('uf-input')!;
    typeInto(native(el), 'changed');
    form.reset();
    await el.updateComplete;
    expect(el.value).toBe('start');
  });

  it('is disabled by a disabled fieldset and not submitted', async () => {
    const form = await fixture<HTMLFormElement>(
      '<form><fieldset disabled><uf-input name="q" value="x"></uf-input></fieldset></form>',
    );
    await settle();
    expect(native(form.querySelector('uf-input')!).disabled).toBe(true);
    expect(new FormData(form).has('q')).toBe(false);
  });

  it('has no axe violations', async () => {
    await fixture(`
      <main>
        <uf-input label="Name" hint="As on your passport"></uf-input>
        <uf-input label="Email" type="email" required></uf-input>
        <uf-input label="Disabled" disabled></uf-input>
      </main>`);
    expect(await axeViolations()).toEqual([]);
  });
});
