import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, press, settle, typeInto } from '../../test-utils.js';
import './combobox.js';

const options = `
  <option value="it">Italy</option>
  <option value="fr">France</option>
  <option value="de" disabled>Germany</option>
  <optgroup label="Elsewhere">
    <option value="jp">Japan</option>
    <option value="us">United States</option>
  </optgroup>`;

async function setup(attrs = '') {
  const form = await fixture<HTMLFormElement>(
    `<main><form><uf-combobox name="country" label="Country" ${attrs}>${options}</uf-combobox></form></main>`,
    'form',
  );
  const el = form.querySelector('uf-combobox')!;
  await settle();
  const input = el.shadowRoot!.querySelector('input')!;
  const listbox = el.shadowRoot!.querySelector<HTMLElement>('[role="listbox"]')!;
  const visible = () => [...listbox.querySelectorAll('[role="option"]:not([part="empty"])')].map((o) => o.textContent!.trim());
  const active = () => {
    const id = input.getAttribute('aria-activedescendant');
    return id ? el.shadowRoot!.getElementById(id)!.textContent!.trim() : null;
  };
  const key = async (k: string) => {
    press(input, k);
    await el.updateComplete;
  };
  return { form, el, input, listbox, visible, active, key };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-combobox', () => {
  it('has combobox semantics wired to its listbox', async () => {
    const { input, listbox } = await setup();
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-controls')).toBe(listbox.id);
    expect(input.labels?.length).toBe(1);
  });

  it('starts empty, or with the value attribute', async () => {
    const a = await setup();
    expect(a.el.value).toBe('');
    expect(a.input.value).toBe('');
    const b = await setup('value="jp"');
    expect(b.el.value).toBe('jp');
    expect(b.input.value).toBe('Japan');
  });

  it('keeps its value when options are appended after it is connected', async () => {
    const el = document.createElement('uf-combobox');
    el.value = 'b';
    document.body.append(el);
    await el.updateComplete;
    el.innerHTML = '<option value="a">A</option><option value="b">B</option>';
    await new Promise((r) => setTimeout(r));
    await el.updateComplete;
    expect(el.value).toBe('b');
  });

  it('keeps a value set before its options were read', async () => {
    const el = document.createElement('uf-combobox');
    el.value = 'jp';
    el.innerHTML = '<option value="it">Italy</option><option value="jp">Japan</option>';
    document.body.append(el);
    await el.updateComplete;
    expect(el.value).toBe('jp');
    expect(el.shadowRoot!.querySelector('input')!.value).toBe('Japan');
  });

  it('opens with ArrowDown and highlights the first option', async () => {
    const { el, input, listbox, active, key } = await setup();
    await key('ArrowDown');
    expect(el.open).toBe(true);
    expect(listbox.matches(':popover-open')).toBe(true);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(active()).toBe('Italy');
  });

  it('moves with arrows, skipping disabled options, and picks with Enter', async () => {
    const { el, input, active, key } = await setup();
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    await key('ArrowDown');
    await key('ArrowDown');
    expect(active()).toBe('France');
    await key('ArrowDown');
    expect(active()).toBe('Japan');
    await key('Enter');
    expect(el.value).toBe('jp');
    expect(input.value).toBe('Japan');
    expect(el.open).toBe(false);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('filters as you type and highlights the first match', async () => {
    const { el, input, visible, active, key } = await setup();
    typeInto(input, 'an');
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(visible()).toEqual(['France', 'Germany', 'Japan']);
    expect(active()).toBe('France');
    await key('Enter');
    expect(el.value).toBe('fr');
  });

  it('shows a message when nothing matches', async () => {
    const { el, input, listbox, visible } = await setup();
    typeInto(input, 'zzz');
    await el.updateComplete;
    expect(visible()).toEqual([]);
    expect(listbox.querySelector('[part="empty"]')?.textContent).toContain('No results');
  });

  it('keeps the listbox valid when nothing matches, and Enter picks nothing', async () => {
    const { el, input, listbox, key } = await setup();
    typeInto(input, 'zzz');
    await el.updateComplete;
    // A listbox must contain options: the message is a disabled one.
    const empty = listbox.querySelector('[part="empty"]')!;
    expect(empty.getAttribute('role')).toBe('option');
    expect(empty.getAttribute('aria-disabled')).toBe('true');
    expect(await axeViolations()).toEqual([]);
    await key('Enter');
    expect(el.value).toBe('');
  });

  it('shows group headings', async () => {
    const { el, listbox, key } = await setup();
    await key('ArrowDown');
    await el.updateComplete;
    expect(listbox.querySelector('[part="group-label"]')?.textContent).toBe('Elsewhere');
  });

  it('picks an option on click', async () => {
    const { el, listbox, key } = await setup();
    await key('ArrowDown');
    const france = [...listbox.querySelectorAll<HTMLElement>('[role="option"]')].find((o) => o.textContent!.includes('France'))!;
    france.click();
    await el.updateComplete;
    expect(el.value).toBe('fr');
    expect(france.getAttribute('aria-selected')).toBe('true');
  });

  it('closes on Escape and restores the selected label', async () => {
    const { el, input, key } = await setup('value="it"');
    typeInto(input, 'Fra');
    await el.updateComplete;
    await key('Escape');
    expect(el.open).toBe(false);
    expect(input.value).toBe('Italy');
    expect(el.value).toBe('it');
  });

  it('on blur, accepts an exact match and reverts anything else', async () => {
    const { el, input } = await setup('value="it"');
    input.focus();
    typeInto(input, 'japan');
    input.blur();
    await el.updateComplete;
    expect(el.value).toBe('jp');
    expect(input.value).toBe('Japan');

    input.focus();
    typeInto(input, 'Atlantis');
    input.blur();
    await el.updateComplete;
    expect(el.value).toBe('jp');
    expect(input.value).toBe('Japan');
  });

  it('clears the value when the text is erased', async () => {
    const { el, input } = await setup('value="it"');
    input.focus();
    typeInto(input, '');
    input.blur();
    await el.updateComplete;
    expect(el.value).toBe('');
  });

  it('submits, validates and resets with its form', async () => {
    const { form, el, key } = await setup('required');
    expect(el.validity.valueMissing).toBe(true);
    await key('ArrowDown');
    await key('Enter');
    expect(el.checkValidity()).toBe(true);
    expect(new FormData(form).get('country')).toBe('it');
    form.reset();
    await el.updateComplete;
    expect(el.value).toBe('');
  });

  it('has no axe violations, closed and open', async () => {
    const { key } = await setup('hint="Where you live"');
    expect(await axeViolations()).toEqual([]);
    await key('ArrowDown');
    expect(await axeViolations()).toEqual([]);
  });
});
