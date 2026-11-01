import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, settle } from '../../test-utils.js';
import { setTranslations } from '../../internal/i18n.js';
import './multi-select.js';
import type { UfMultiSelect } from './multi-select.js';

const input = (el: UfMultiSelect) => el.shadowRoot!.querySelector('input')!;
const chips = (el: UfMultiSelect) => [...el.shadowRoot!.querySelectorAll('[part="chip"]')].map((c) => c.textContent!.trim());
const options = (el: UfMultiSelect) => [...el.shadowRoot!.querySelectorAll<HTMLElement>('[role="option"]')];
const option = (el: UfMultiSelect, label: string) => options(el).find((o) => o.textContent!.trim() === label)!;

const markup = (attrs = '') => `
  <form>
    <uf-multi-select name="toppings" label="Toppings" ${attrs}>
      <option value="cheese" selected>Cheese</option>
      <option value="olives">Olives</option>
      <option value="basil">Basil</option>
      <option value="ham" disabled>Ham</option>
    </uf-multi-select>
  </form>`;

async function setup(attrs = '') {
  const form = await fixture<HTMLFormElement>(markup(attrs));
  const el = form.querySelector('uf-multi-select')!;
  await settle();
  return { form, el };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-multi-select', () => {
  it('starts with the selected options as chips, and submits every value', async () => {
    const { form, el } = await setup();
    expect(el.value).toEqual(['cheese']);
    expect(chips(el)).toEqual(['Cheese']);
    expect(input(el).getAttribute('role')).toBe('combobox');
    expect(new FormData(form).getAll('toppings')).toEqual(['cheese']);
  });

  it('picks and unpicks options from the list, keeping it open, in the order of the options', async () => {
    const { form, el } = await setup();
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    el.show();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[role="listbox"]')!.getAttribute('aria-multiselectable')).toBe('true');

    option(el, 'Basil').click();
    option(el, 'Olives').click();
    await el.updateComplete;
    expect(el.value).toEqual(['cheese', 'olives', 'basil']);
    expect(el.open).toBe(true);
    expect(option(el, 'Olives').getAttribute('aria-selected')).toBe('true');
    expect(new FormData(form).getAll('toppings')).toEqual(['cheese', 'olives', 'basil']);

    option(el, 'Cheese').click();
    option(el, 'Ham').click();
    await el.updateComplete;
    expect(el.value).toEqual(['olives', 'basil']);
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('filters by typing, and picks the highlighted option with Enter', async () => {
    const { el } = await setup();
    input(el).focus();
    await userEvent.keyboard('ol');
    await el.updateComplete;
    expect(options(el).map((o) => o.textContent!.trim())).toEqual(['Olives']);
    await userEvent.keyboard('{Enter}');
    await el.updateComplete;
    expect(el.value).toEqual(['cheese', 'olives']);
    expect(input(el).value).toBe('');
  });

  it('removes a chip with its button, or the last one with Backspace', async () => {
    const { el } = await setup();
    el.value = ['cheese', 'basil'];
    await el.updateComplete;
    const remove = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('[part="chip-remove"]');
    expect(remove[1].getAttribute('aria-label')).toBe('Remove Basil');
    remove[1].click();
    await el.updateComplete;
    expect(el.value).toEqual(['cheese']);

    input(el).focus();
    await userEvent.keyboard('{Backspace}');
    await el.updateComplete;
    expect(el.value).toEqual([]);
  });

  it('is required: blocks submission while empty', async () => {
    const { form, el } = await setup('required');
    el.value = [];
    expect(el.checkValidity()).toBe(false);
    expect(el.validity.valueMissing).toBe(true);
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', onSubmit);
    form.requestSubmit();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('resets to the selected options with the form', async () => {
    const { form, el } = await setup();
    el.value = ['olives', 'basil'];
    form.reset();
    await settle();
    expect(el.value).toEqual(['cheese']);
  });

  it('translates the remove buttons', async () => {
    setTranslations({ removeOption: 'Rimuovi {name}' }, 'it');
    const el = await fixture<UfMultiSelect>('<div lang="it"><uf-multi-select label="Gusti"><option selected>Fragola</option></uf-multi-select></div>', 'uf-multi-select');
    await settle();
    expect(el.shadowRoot!.querySelector('[part="chip-remove"]')!.getAttribute('aria-label')).toBe('Rimuovi Fragola');
  });

  it('has no axe violations, open or closed', async () => {
    document.body.innerHTML = `<main>${markup()}</main>`;
    await settle();
    const el = document.querySelector('uf-multi-select')!;
    expect(await axeViolations()).toEqual([]);
    el.show();
    await el.updateComplete;
    expect(await axeViolations()).toEqual([]);
  });
});
