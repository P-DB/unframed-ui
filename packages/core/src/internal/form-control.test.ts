import { afterEach, describe, expect, it, vi } from 'vitest';
import '../index.js';
import { fixture } from '../test-utils.js';

type Control = HTMLElement & Record<string, unknown> & { checkValidity(): boolean; validity: ValidityState };

afterEach(() => {
  document.body.innerHTML = '';
});

/**
 * Every form control, required and empty, with the property to set from code
 * and a valid value for it. Forms and frameworks read the value and validity
 * right after setting them, in the same task.
 */
const controls: { tag: string; markup: string; prop: string; value: unknown; submitted: string }[] = [
  { tag: 'uf-input', markup: '<uf-input name="f" required></uf-input>', prop: 'value', value: 'John', submitted: 'John' },
  { tag: 'uf-textarea', markup: '<uf-textarea name="f" required></uf-textarea>', prop: 'value', value: 'Hi', submitted: 'Hi' },
  {
    tag: 'uf-select',
    markup: '<uf-select name="f" placeholder="Choose" required><option value="a">A</option><option value="b">B</option></uf-select>',
    prop: 'value',
    value: 'b',
    submitted: 'b',
  },
  {
    tag: 'uf-combobox',
    markup: '<uf-combobox name="f" required><option value="a">A</option><option value="b">B</option></uf-combobox>',
    prop: 'value',
    value: 'b',
    submitted: 'b',
  },
  {
    tag: 'uf-radio-group',
    markup: '<uf-radio-group name="f" label="Pick" required><uf-radio value="a">A</uf-radio><uf-radio value="b">B</uf-radio></uf-radio-group>',
    prop: 'value',
    value: 'b',
    submitted: 'b',
  },
  { tag: 'uf-checkbox', markup: '<uf-checkbox name="f" required>Agree</uf-checkbox>', prop: 'checked', value: true, submitted: 'on' },
  { tag: 'uf-switch', markup: '<uf-switch name="f" required>On</uf-switch>', prop: 'checked', value: true, submitted: 'on' },
];

describe('form controls set from code', () => {
  for (const { tag, markup, prop, value, submitted } of controls) {
    describe(tag, () => {
      it('updates validity and the form value in the same task', async () => {
        const form = await fixture<HTMLFormElement>(`<form>${markup}</form>`);
        const el = form.querySelector<Control>(tag)!;
        expect(el.checkValidity()).toBe(false);

        el[prop] = value;
        expect(el.validity.valid).toBe(true);
        expect(el.checkValidity()).toBe(true);
        expect(new FormData(form).get('f')).toBe(submitted);
      });

      it('lets the form submit right after the value is set', async () => {
        const form = await fixture<HTMLFormElement>(`<form>${markup}</form>`);
        const onSubmit = vi.fn((event: Event) => event.preventDefault());
        form.addEventListener('submit', onSubmit);
        const el = form.querySelector<Control>(tag)!;

        el[prop] = value;
        form.requestSubmit();
        expect(onSubmit).toHaveBeenCalledOnce();
      });

      it('becomes invalid again in the same task when the value is cleared', async () => {
        const form = await fixture<HTMLFormElement>(`<form>${markup}</form>`);
        const el = form.querySelector<Control>(tag)!;
        el[prop] = value;
        el[prop] = typeof value === 'boolean' ? false : '';
        expect(el.checkValidity()).toBe(false);
      });
    });
  }

  it('updates validity at once when a constraint changes', async () => {
    const el = await fixture<Control>('<uf-input value="abc"></uf-input>');
    el.pattern = '[0-9]+';
    expect(el.validity.patternMismatch).toBe(true);
    el.pattern = '[a-z]+';
    expect(el.checkValidity()).toBe(true);
  });

  it('updates validity at once when required is toggled', async () => {
    const el = await fixture<Control>('<uf-input></uf-input>');
    el.required = true;
    expect(el.checkValidity()).toBe(false);
    el.required = false;
    expect(el.checkValidity()).toBe(true);
  });
});
