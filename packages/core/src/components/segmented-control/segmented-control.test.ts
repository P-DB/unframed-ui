import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, settle } from '../../test-utils.js';
import './segmented-control.js';
import type { UfSegmentedControl } from './segmented-control.js';

const buttons = (el: UfSegmentedControl) => [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
const checked = (el: UfSegmentedControl) => buttons(el).find((b) => b.getAttribute('aria-checked') === 'true')?.textContent?.trim();

const markup = (attrs = '') => `
  <form>
    <uf-segmented-control name="view" label="View" ${attrs}>
      <option value="list">List</option>
      <option value="grid">Grid</option>
      <option value="board" disabled>Board</option>
      <option value="map">Map</option>
    </uf-segmented-control>
  </form>`;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-segmented-control', () => {
  it('is a labelled radio group with the first option selected', async () => {
    const form = await fixture<HTMLFormElement>(markup());
    const el = form.querySelector('uf-segmented-control')!;
    const group = el.shadowRoot!.querySelector('[role="radiogroup"]')!;
    expect(el.shadowRoot!.getElementById(group.getAttribute('aria-labelledby')!)?.textContent?.trim()).toBe('View');
    expect(buttons(el)).toHaveLength(4);
    expect(el.value).toBe('list');
    expect(checked(el)).toBe('List');
    expect(new FormData(form).get('view')).toBe('list');
  });

  it('starts from the value attribute, or a selected option', async () => {
    const byValue = (await fixture<HTMLFormElement>(markup('value="grid"'))).querySelector('uf-segmented-control')!;
    expect(byValue.value).toBe('grid');
    const bySelected = await fixture<UfSegmentedControl>('<uf-segmented-control><option>A</option><option selected>B</option></uf-segmented-control>');
    expect(bySelected.value).toBe('B');
  });

  it('selects on click and emits input and change, but not for a disabled option', async () => {
    const el = (await fixture<HTMLFormElement>(markup())).querySelector('uf-segmented-control')!;
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    buttons(el)[1].click();
    await el.updateComplete;
    expect(el.value).toBe('grid');
    expect(onChange).toHaveBeenCalledOnce();
    buttons(el)[2].click();
    expect(el.value).toBe('grid');
  });

  it('moves and selects with arrow keys, skipping disabled options, with one tab stop', async () => {
    const el = (await fixture<HTMLFormElement>(markup())).querySelector('uf-segmented-control')!;
    expect(buttons(el).map((b) => b.tabIndex)).toEqual([0, -1, -1, -1]);
    buttons(el)[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    await settle();
    expect(el.value).toBe('grid');
    await userEvent.keyboard('{ArrowRight}');
    await settle();
    expect(el.value).toBe('map');
    expect(el.shadowRoot!.activeElement?.textContent?.trim()).toBe('Map');
    await userEvent.keyboard('{Home}');
    await settle();
    expect(el.value).toBe('list');
    await userEvent.keyboard('{ArrowLeft}');
    await settle();
    expect(el.value).toBe('map');
  });

  it('resets with the form, and follows a value set from code', async () => {
    const form = await fixture<HTMLFormElement>(markup('value="grid"'));
    const el = form.querySelector('uf-segmented-control')!;
    el.value = 'map';
    await el.updateComplete;
    expect(checked(el)).toBe('Map');
    form.reset();
    await settle();
    expect(el.value).toBe('grid');
  });

  it('is disabled by a disabled fieldset', async () => {
    const form = await fixture<HTMLFormElement>(`<form><fieldset disabled>${markup()}</fieldset></form>`);
    const el = form.querySelector('uf-segmented-control')!;
    await el.updateComplete;
    expect(buttons(el).every((b) => b.disabled)).toBe(true);
    expect(new FormData(form).has('view')).toBe(false);
  });

  it('has no axe violations', async () => {
    await fixture(`<main>${markup()}</main>`);
    expect(await axeViolations()).toEqual([]);
  });
});
