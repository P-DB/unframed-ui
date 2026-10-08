import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, settle } from '../../test-utils.js';
import './select.js';
import type { UfSelect } from './select.js';

const native = (el: UfSelect) => el.shadowRoot!.querySelector('select')!;

const options = `
  <option value="it">Italy</option>
  <option value="fr">France</option>
  <optgroup label="Far away">
    <option value="jp">Japan</option>
  </optgroup>`;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-select', () => {
  it('mirrors light-DOM options, including groups', async () => {
    const el = await fixture<UfSelect>(`<uf-select label="Country">${options}</uf-select>`);
    expect([...native(el).options].map((o) => o.value)).toEqual(['it', 'fr', 'jp']);
    expect(native(el).querySelector('optgroup')?.label).toBe('Far away');
  });

  it('defaults to the first option, like a native select', async () => {
    const el = await fixture<UfSelect>(`<uf-select>${options}</uf-select>`);
    expect(el.value).toBe('it');
  });

  it('honours the value attribute and selected options', async () => {
    const a = await fixture<UfSelect>(`<uf-select value="fr">${options}</uf-select>`);
    expect(a.value).toBe('fr');
    const b = await fixture<UfSelect>(
      '<uf-select><option value="a">A</option><option value="b" selected>B</option></uf-select>',
    );
    expect(b.value).toBe('b');
  });

  it('starts empty with a placeholder and requires a choice', async () => {
    const el = await fixture<UfSelect>(`<uf-select placeholder="Choose…" required>${options}</uf-select>`);
    expect(el.value).toBe('');
    expect(el.validity.valueMissing).toBe(true);
  });

  it('updates value on change, emits change, and submits', async () => {
    const form = await fixture<HTMLFormElement>(`<form><uf-select name="country">${options}</uf-select></form>`);
    const el = form.querySelector('uf-select')!;
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    native(el).value = 'jp';
    native(el).dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.value).toBe('jp');
    expect(onChange).toHaveBeenCalledOnce();
    expect(new FormData(form).get('country')).toBe('jp');
  });

  it('picks up options added later', async () => {
    const el = await fixture<UfSelect>('<uf-select placeholder="Pick"></uf-select>');
    const option = document.createElement('option');
    option.value = 'late';
    option.textContent = 'Late';
    el.append(option);
    await new Promise((r) => setTimeout(r));
    await settle();
    expect([...native(el).options].map((o) => o.value)).toContain('late');
  });

  it('resets to its initial value', async () => {
    const form = await fixture<HTMLFormElement>(`<form><uf-select value="fr">${options}</uf-select></form>`);
    const el = form.querySelector('uf-select')!;
    el.value = 'jp';
    await el.updateComplete;
    form.reset();
    await settle();
    expect(el.value).toBe('fr');
  });

  it('has no axe violations', async () => {
    await fixture(`<main><uf-select label="Country" hint="Where you live">${options}</uf-select></main>`);
    expect(await axeViolations()).toEqual([]);
  });
});
