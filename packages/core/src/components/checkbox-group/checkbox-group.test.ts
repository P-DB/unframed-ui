import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, settle } from '../../test-utils.js';
import './checkbox-group.js';
import type { UfCheckbox } from '../checkbox/checkbox.js';
import type { UfCheckboxGroup } from './checkbox-group.js';

const markup = `
  <main>
    <form>
      <uf-checkbox-group label="Toppings">
        <uf-checkbox select-all>All toppings</uf-checkbox>
        <uf-checkbox name="topping" value="cheese">Cheese</uf-checkbox>
        <uf-checkbox name="topping" value="olives">Olives</uf-checkbox>
        <uf-checkbox name="topping" value="basil">Basil</uf-checkbox>
      </uf-checkbox-group>
    </form>
  </main>`;

async function setup() {
  const group = await fixture<UfCheckboxGroup>(markup, 'uf-checkbox-group');
  await settle();
  const [all, ...options] = [...group.querySelectorAll<UfCheckbox>('uf-checkbox')];
  const click = async (box: UfCheckbox) => {
    box.shadowRoot!.querySelector('input')!.click();
    await settle();
  };
  return { group, all, options, click };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-checkbox-group', () => {
  it('turns "select all" indeterminate when only some are checked', async () => {
    const { all, options, click } = await setup();
    await click(options[0]);
    expect(all.indeterminate).toBe(true);
    expect(all.checked).toBe(false);
    expect(all.matches(':state(indeterminate)')).toBe(true);
    expect(all.shadowRoot!.querySelector('input')!.indeterminate).toBe(true);
  });

  it('checks "select all" when every option is checked, and clears it when none are', async () => {
    const { all, options, click } = await setup();
    for (const option of options) await click(option);
    expect(all.checked).toBe(true);
    expect(all.indeterminate).toBe(false);
    for (const option of options) await click(option);
    expect(all.checked).toBe(false);
    expect(all.indeterminate).toBe(false);
  });

  it('updates "select all" when a checkbox is checked from code', async () => {
    const { all, options } = await setup();
    options[0].checked = true;
    await options[0].updateComplete;
    expect(all.indeterminate).toBe(true);
    for (const option of options) option.checked = true;
    await Promise.all(options.map((o) => o.updateComplete));
    expect(all.checked).toBe(true);
    expect(all.indeterminate).toBe(false);
  });

  it('checks and unchecks every option from "select all"', async () => {
    const { all, options, click } = await setup();
    await click(options[1]);
    await click(all); // indeterminate -> checked: selects everything
    expect(options.map((o) => o.checked)).toEqual([true, true, true]);
    await click(all);
    expect(options.map((o) => o.checked)).toEqual([false, false, false]);
  });

  it('leaves disabled options alone', async () => {
    const { all, options, click } = await setup();
    options[2].disabled = true;
    await click(all);
    expect(options.map((o) => o.checked)).toEqual([true, true, false]);
    expect(all.indeterminate).toBe(true);
  });

  it('exposes and accepts the checked values, and submits each checkbox', async () => {
    const { group, all, options } = await setup();
    group.value = ['olives', 'basil'];
    await settle();
    expect(options.map((o) => o.checked)).toEqual([false, true, true]);
    expect(all.indeterminate).toBe(true);
    expect(group.value).toEqual(['olives', 'basil']);
    expect(new FormData(group.closest('form')!).getAll('topping')).toEqual(['olives', 'basil']);
  });

  it('emits change before other listeners read its value', async () => {
    const { group, options, click } = await setup();
    const seen = vi.fn(() => group.value);
    group.addEventListener('change', seen);
    await click(options[0]);
    expect(seen).toHaveLastReturnedWith(['cheese']);
  });

  it('has no axe violations', async () => {
    const { options, click } = await setup();
    await click(options[0]);
    expect(await axeViolations()).toEqual([]);
  });
});
