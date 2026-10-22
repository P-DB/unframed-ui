import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import { resetTranslations, setTranslations } from '../../internal/i18n.js';
import { axeViolations, commit, fixture, nextFrame, typeInto } from '../../test-utils.js';
import './date-range-picker.js';
import type { UfDateRangePicker } from './date-range-picker.js';

const input = (el: UfDateRangePicker, which: 'start' | 'end') => el.shadowRoot!.querySelector<HTMLInputElement>(`[data-end="${which}"]`)!;
const toggle = (el: UfDateRangePicker) => el.shadowRoot!.querySelector<HTMLButtonElement>('[part="toggle"]')!;
const popup = (el: UfDateRangePicker) => el.shadowRoot!.querySelector<HTMLElement>('.popup')!;
const calendar = (el: UfDateRangePicker) => el.shadowRoot!.querySelector('uf-calendar')!;
const day = (el: UfDateRangePicker, iso: string) => calendar(el).shadowRoot!.querySelector<HTMLElement>(`td[data-date="${iso}"]`)!;

afterEach(() => {
  document.body.innerHTML = '';
  resetTranslations();
});

async function enter(el: UfDateRangePicker, which: 'start' | 'end', text: string) {
  typeInto(input(el, which), text);
  commit(input(el, which));
  await el.updateComplete;
}

describe('uf-date-range-picker', () => {
  it('shows the range in the language format, and keeps it as an ISO interval', async () => {
    const el = await fixture<UfDateRangePicker>('<uf-date-range-picker lang="it" label="Soggiorno" value="2026-10-14/2026-10-18"></uf-date-range-picker>');
    expect([el.start, el.end, el.value]).toEqual(['2026-10-14', '2026-10-18', '2026-10-14/2026-10-18']);
    expect([input(el, 'start').value, input(el, 'end').value]).toEqual(['14/10/2026', '18/10/2026']);
  });

  it('names each input after the label', async () => {
    const el = await fixture<UfDateRangePicker>('<uf-date-range-picker label="Stay"></uf-date-range-picker>');
    expect(input(el, 'start').getAttribute('aria-label')).toBe('Stay, Start date');
    expect(input(el, 'end').getAttribute('aria-label')).toBe('Stay, End date');
  });

  it('takes typed dates when committed, and fires change for each', async () => {
    const el = await fixture<UfDateRangePicker>('<uf-date-range-picker lang="en-US" label="Stay"></uf-date-range-picker>');
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    await enter(el, 'start', '10/14/2026');
    expect([el.start, el.value]).toEqual(['2026-10-14', '']);
    await enter(el, 'end', '10/18/2026');
    expect(el.value).toBe('2026-10-14/2026-10-18');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('reports an incomplete range, a reversed one, and text that is not a date', async () => {
    const el = await fixture<UfDateRangePicker>('<uf-date-range-picker lang="en-US" label="Stay"></uf-date-range-picker>');
    await enter(el, 'start', '10/14/2026');
    expect(el.validationMessage).toBe('Enter both a start and an end date.');
    await enter(el, 'end', '10/10/2026');
    expect(el.validationMessage).toBe("The end date can't be before the start date.");
    await enter(el, 'end', 'next week');
    expect(el.validity.badInput).toBe(true);
    expect(input(el, 'end').value).toBe('next week');
    await enter(el, 'end', '10/20/2026');
    expect(el.checkValidity()).toBe(true);
  });

  it('validates required, min, max and disabled dates', async () => {
    const el = await fixture<UfDateRangePicker>('<uf-date-range-picker lang="en-US" label="Stay" required min="2026-10-10" max="2026-10-20"></uf-date-range-picker>');
    expect(el.validity.valueMissing).toBe(true);
    el.value = '2026-10-01/2026-10-12';
    expect(el.validationMessage).toBe('Choose October 10, 2026 or later.');
    el.value = '2026-10-12/2026-10-30';
    expect(el.validationMessage).toBe('Choose October 20, 2026 or earlier.');
    el.isDateDisabled = (iso) => iso === '2026-10-15';
    el.value = '2026-10-15/2026-10-16';
    expect(el.validationMessage).toBe('This date is not available.');
    el.value = '2026-10-12/2026-10-16';
    expect(el.checkValidity()).toBe(true);
  });

  it('submits, resets and restores with the form', async () => {
    const form = await fixture<HTMLFormElement>('<form><uf-date-range-picker name="stay" label="Stay" value="2026-10-14/2026-10-18"></uf-date-range-picker></form>');
    const el = form.querySelector('uf-date-range-picker')!;
    expect(new FormData(form).get('stay')).toBe('2026-10-14/2026-10-18');
    el.end = '2026-10-21';
    expect(new FormData(form).get('stay')).toBe('2026-10-14/2026-10-21');
    form.reset();
    await el.updateComplete;
    expect(el.value).toBe('2026-10-14/2026-10-18');
  });

  it('picks both dates in the calendar, closes, and focuses the end input', async () => {
    const el = await fixture<UfDateRangePicker>('<uf-date-range-picker lang="en-US" label="Stay" value="2026-10-14/2026-10-18"></uf-date-range-picker>');
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    el.show();
    await nextFrame();
    await calendar(el).updateComplete;
    day(el, '2026-10-20').click();
    await calendar(el).updateComplete;
    day(el, '2026-10-24').click();
    await nextFrame();
    expect(el.value).toBe('2026-10-20/2026-10-24');
    expect(onChange).toHaveBeenCalledOnce();
    expect(el.open).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(input(el, 'end'));
  });

  it('is under the field from its first frame', async () => {
    const el = await fixture<UfDateRangePicker>('<div style="padding: 200px 20px"><uf-date-range-picker label="Stay"></uf-date-range-picker></div>', 'uf-date-range-picker');
    toggle(el).click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const box = el.shadowRoot!.querySelector('.box')!.getBoundingClientRect();
    const rect = popup(el).getBoundingClientRect();
    expect(Math.round(rect.top - box.bottom)).toBe(4);
  });

  it('closes with a real Escape key press and gives focus back to the start input', async () => {
    const el = await fixture<UfDateRangePicker>('<uf-date-range-picker label="Stay" value="2026-10-14/2026-10-18"></uf-date-range-picker>');
    const shown = new Promise((resolve) => el.addEventListener('uf-show', resolve, { once: true }));
    await userEvent.click(toggle(el));
    await shown;
    await calendar(el).updateComplete;
    const hidden = new Promise((resolve) => el.addEventListener('uf-hide', resolve, { once: true }));
    await userEvent.keyboard('{Escape}');
    await hidden;
    expect(popup(el).matches(':popover-open')).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(input(el, 'start'));
  });

  it('translates its texts', async () => {
    setTranslations({ chooseDates: 'Scegli le date', startDate: 'Data di inizio', rangeIncomplete: 'Inserisci entrambe le date.' }, 'it');
    const el = await fixture<UfDateRangePicker>('<uf-date-range-picker lang="it" label="Soggiorno"></uf-date-range-picker>');
    expect(toggle(el).getAttribute('aria-label')).toBe('Scegli le date');
    expect(input(el, 'start').getAttribute('aria-label')).toBe('Soggiorno, Data di inizio');
    await enter(el, 'start', '14/10/2026');
    expect(el.validationMessage).toBe('Inserisci entrambe le date.');
  });

  it('has no axe violations, closed and open', async () => {
    const el = await fixture<UfDateRangePicker>('<main><uf-date-range-picker lang="en-US" label="Stay" hint="Check-in from 3 pm" value="2026-10-14/2026-10-18"></uf-date-range-picker></main>', 'uf-date-range-picker');
    expect(await axeViolations()).toEqual([]);
    el.show();
    await nextFrame();
    expect(await axeViolations()).toEqual([]);
  });
});
