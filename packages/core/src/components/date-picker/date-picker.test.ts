import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import { resetTranslations, setTranslations } from '../../internal/i18n.js';
import { axeViolations, commit, fixture, nextFrame, typeInto } from '../../test-utils.js';
import './date-picker.js';
import type { UfDatePicker } from './date-picker.js';

const input = (el: UfDatePicker) => el.shadowRoot!.querySelector('input')!;
const toggle = (el: UfDatePicker) => el.shadowRoot!.querySelector<HTMLButtonElement>('[part="toggle"]')!;
const popup = (el: UfDatePicker) => el.shadowRoot!.querySelector<HTMLElement>('.popup')!;
const calendar = (el: UfDatePicker) => el.shadowRoot!.querySelector('uf-calendar')!;

afterEach(() => {
  document.body.innerHTML = '';
  resetTranslations();
});

/** Types text and commits it, like a user leaving the field. */
async function enter(el: UfDatePicker, text: string) {
  typeInto(input(el), text);
  commit(input(el));
  await el.updateComplete;
}

describe('uf-date-picker', () => {
  it('shows the value in the language format, and keeps it as YYYY-MM-DD', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker lang="it" label="Arrivo" value="2026-10-14"></uf-date-picker>');
    expect(el.value).toBe('2026-10-14');
    expect(input(el).value).toBe('14/10/2026');
    el.setAttribute('lang', 'en-US');
    await new Promise((r) => setTimeout(r));
    await el.updateComplete;
    expect(input(el).value).toBe('10/14/2026');
  });

  it('has the format as placeholder, in the language order', async () => {
    const it = await fixture<UfDatePicker>('<uf-date-picker lang="it" label="Data"></uf-date-picker>');
    expect(input(it).placeholder).toBe('dd/mm/yyyy');
    const de = await fixture<UfDatePicker>('<uf-date-picker lang="de" label="Datum"></uf-date-picker>');
    expect(input(de).placeholder).toBe('dd.mm.yyyy');
    const custom = await fixture<UfDatePicker>('<uf-date-picker label="Date" placeholder="Pick a day"></uf-date-picker>');
    expect(input(custom).placeholder).toBe('Pick a day');
  });

  it('takes a typed date when committed, and fires input and change once', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker lang="it" label="Data"></uf-date-picker>');
    const onInput = vi.fn();
    const onChange = vi.fn();
    el.addEventListener('input', onInput);
    el.addEventListener('change', onChange);
    typeInto(input(el), '1/2/26');
    expect(el.value).toBe('');
    expect(onInput).not.toHaveBeenCalled();
    commit(input(el));
    await el.updateComplete;
    expect(el.value).toBe('2026-02-01');
    expect(input(el).value).toBe('01/02/2026');
    expect(onInput).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('commits on Enter too', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker lang="en-US" label="Date"></uf-date-picker>');
    typeInto(input(el), '10/14/2026');
    input(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(el.value).toBe('2026-10-14');
  });

  it('keeps text that is not a date, and reports it', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker lang="it" label="Data" value="2026-10-14"></uf-date-picker>');
    await enter(el, '31/02/2026');
    expect(el.value).toBe('');
    expect(input(el).value).toBe('31/02/2026');
    expect(el.validity.badInput).toBe(true);
    expect(el.validationMessage).toMatch(/^Enter a date like \d\d\/\d\d\/\d{4}\.$/);
    await enter(el, '28/02/2026');
    expect(el.checkValidity()).toBe(true);
  });

  it('clears the value when the text is erased', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker label="Date" value="2026-10-14"></uf-date-picker>');
    await enter(el, '');
    expect(el.value).toBe('');
    expect(el.checkValidity()).toBe(true);
  });

  it('validates required, min, max and disabled dates, with readable messages', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker lang="en-US" label="Date" required min="2026-10-10" max="2026-10-20"></uf-date-picker>');
    expect(el.validity.valueMissing).toBe(true);
    el.value = '2026-10-01';
    expect(el.validity.rangeUnderflow).toBe(true);
    expect(el.validationMessage).toBe('Choose October 10, 2026 or later.');
    el.value = '2026-10-30';
    expect(el.validationMessage).toBe('Choose October 20, 2026 or earlier.');
    el.isDateDisabled = (iso) => iso === '2026-10-15';
    el.value = '2026-10-15';
    expect(el.validationMessage).toBe('This date is not available.');
    el.value = '2026-10-16';
    expect(el.checkValidity()).toBe(true);
  });

  it('submits, resets and restores with the form', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-date-picker name="when" label="When" value="2026-10-14"></uf-date-picker></form>');
    const el = form.querySelector('uf-date-picker')!;
    expect(new FormData(form).get('when')).toBe('2026-10-14');
    el.value = '2026-12-25';
    expect(new FormData(form).get('when')).toBe('2026-12-25');
    form.reset();
    await el.updateComplete;
    expect(el.value).toBe('2026-10-14');
  });

  it('opens the calendar from the button, on the selected month, with focus on the day', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker lang="en-US" label="Date" value="2026-10-14"></uf-date-picker>');
    const shown = new Promise((resolve) => el.addEventListener('uf-show', resolve, { once: true }));
    toggle(el).click();
    expect(el.open).toBe(true);
    expect(popup(el).matches(':popover-open')).toBe(true);
    await shown;
    await calendar(el).updateComplete;
    expect(calendar(el).shadowRoot!.activeElement?.getAttribute('data-date')).toBe('2026-10-14');
  });

  for (const how of ['button', 'show()'] as const) {
    it(`is under the field from its first frame, opened with ${how}`, async () => {
      const el = await fixture<UfDatePicker>('<div style="padding: 200px 20px"><uf-date-picker label="Date"></uf-date-picker></div>', 'uf-date-picker');
      if (how === 'button') toggle(el).click();
      else el.show();
      // The first frame after opening: no toggle event or second frame yet.
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const box = el.shadowRoot!.querySelector('.box')!.getBoundingClientRect();
      const rect = popup(el).getBoundingClientRect();
      expect(Math.round(rect.top - box.bottom)).toBe(4);
      expect(Math.round(rect.left)).toBe(Math.round(box.left));
    });
  }

  it('closes when the button is clicked again, instead of reopening', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker label="Date"></uf-date-picker>');
    toggle(el).click();
    await nextFrame();
    toggle(el).click();
    await nextFrame();
    expect(el.open).toBe(false);
    expect(popup(el).matches(':popover-open')).toBe(false);
  });

  it('takes the picked day, closes, and returns focus to the input', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker lang="en-US" label="Date" value="2026-10-14"></uf-date-picker>');
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    el.show();
    await nextFrame();
    calendar(el).shadowRoot!.querySelector<HTMLElement>('td[data-date="2026-10-21"]')!.click();
    await nextFrame();
    expect(el.value).toBe('2026-10-21');
    expect(onChange).toHaveBeenCalledOnce();
    expect(el.open).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(input(el));
  });

  it('gives focus back to the input when it closes with focus inside', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker label="Date" value="2026-10-14"></uf-date-picker>');
    const shown = new Promise((resolve) => el.addEventListener('uf-show', resolve, { once: true }));
    el.show();
    await shown;
    await calendar(el).updateComplete;
    expect(el.shadowRoot!.activeElement).toBe(calendar(el));
    const hidden = new Promise((resolve) => el.addEventListener('uf-hide', resolve, { once: true }));
    // What Escape and a click outside do.
    popup(el).hidePopover();
    await hidden;
    expect(el.open).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(input(el));
  });

  it('closes with a real Escape key press and gives focus back to the input', async () => {
    // A real key press lets Lit render between beforetoggle and the end of the
    // hide; the toggle event must still arrive.
    const el = await fixture<UfDatePicker>('<uf-date-picker label="Date" value="2026-10-14"></uf-date-picker>');
    const shown = new Promise((resolve) => el.addEventListener('uf-show', resolve, { once: true }));
    await userEvent.click(toggle(el));
    await shown;
    await calendar(el).updateComplete;
    const hidden = new Promise((resolve) => el.addEventListener('uf-hide', resolve, { once: true }));
    await userEvent.keyboard('{Escape}');
    await hidden;
    expect(popup(el).matches(':popover-open')).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(input(el));
  });

  it('closes with a real click on the button, and opens again on the next one', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker label="Date"></uf-date-picker>');
    await userEvent.click(toggle(el));
    await nextFrame();
    expect(el.open).toBe(true);
    await userEvent.click(toggle(el));
    await nextFrame();
    expect(el.open).toBe(false);
    expect(popup(el).matches(':popover-open')).toBe(false);
    await userEvent.click(toggle(el));
    await nextFrame();
    expect(popup(el).matches(':popover-open')).toBe(true);
  });

  it('opens with Alt + Down Arrow', async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker label="Date"></uf-date-picker>');
    input(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true }));
    await nextFrame();
    expect(el.open).toBe(true);
  });

  it("can't open when disabled or read-only", async () => {
    const el = await fixture<UfDatePicker>('<uf-date-picker label="Date" readonly></uf-date-picker>');
    el.show();
    expect(el.open).toBe(false);
    expect(toggle(el).disabled).toBe(true);
  });

  it('translates its texts', async () => {
    setTranslations({ chooseDate: 'Scegli la data', invalidDate: 'Scrivi una data come {example}.' }, 'it');
    const el = await fixture<UfDatePicker>('<uf-date-picker lang="it" label="Data"></uf-date-picker>');
    expect(toggle(el).getAttribute('aria-label')).toBe('Scegli la data');
    await enter(el, 'domani');
    expect(el.validationMessage).toMatch(/^Scrivi una data come \d\d\/\d\d\/\d{4}\.$/);
  });

  it('has no axe violations, closed and open', async () => {
    const el = await fixture<UfDatePicker>('<main><uf-date-picker lang="en-US" label="Arrival" hint="Check-in from 3 pm" value="2026-10-14"></uf-date-picker></main>', 'uf-date-picker');
    expect(await axeViolations()).toEqual([]);
    el.show();
    await nextFrame();
    expect(await axeViolations()).toEqual([]);
  });
});
