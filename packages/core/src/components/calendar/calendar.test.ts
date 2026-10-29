import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture, press } from '../../test-utils.js';
import './calendar.js';
import type { UfCalendar } from './calendar.js';

const title = (el: UfCalendar) => el.shadowRoot!.querySelector('.title')!.textContent!.trim();
const cell = (el: UfCalendar, iso: string) => el.shadowRoot!.querySelector<HTMLElement>(`td[data-date="${iso}"]`)!;
const focused = (el: UfCalendar) => el.shadowRoot!.querySelector('td[tabindex="0"]')!.getAttribute('data-date');
const weekdays = (el: UfCalendar) => [...el.shadowRoot!.querySelectorAll('th')].map((th) => th.getAttribute('abbr'));
const nav = (el: UfCalendar, which: 0 | 1) => el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.nav')[which];

afterEach(() => {
  document.body.innerHTML = '';
});

async function key(el: UfCalendar, name: string, shiftKey = false) {
  el.shadowRoot!.querySelector('table')!.dispatchEvent(new KeyboardEvent('keydown', { key: name, shiftKey, bubbles: true, composed: true }));
  await el.updateComplete;
}

describe('uf-calendar', () => {
  it("shows the selected date's month, with six weeks", async () => {
    const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" value="2026-10-14"></uf-calendar>');
    expect(title(el)).toBe('October 2026');
    expect(el.shadowRoot!.querySelectorAll('td').length).toBe(42);
    expect(cell(el, '2026-10-14').getAttribute('aria-selected')).toBe('true');
    expect(cell(el, '2026-10-14').getAttribute('aria-label')).toBe('Wednesday, October 14, 2026');
    expect(focused(el)).toBe('2026-10-14');
  });

  it('starts weeks on the language\'s first day, or first-day-of-week', async () => {
    const us = await fixture<UfCalendar>('<uf-calendar lang="en-US" value="2026-10-14"></uf-calendar>');
    expect(weekdays(us)[0]).toBe('Sunday');
    const it = await fixture<UfCalendar>('<uf-calendar lang="it" value="2026-10-14"></uf-calendar>');
    expect(weekdays(it)[0]).toBe('lunedì');
    expect(title(it)).toBe('ottobre 2026');
    const custom = await fixture<UfCalendar>('<uf-calendar lang="en-US" first-day-of-week="6" value="2026-10-14"></uf-calendar>');
    expect(weekdays(custom)[0]).toBe('Saturday');
  });

  it('marks today', async () => {
    const el = await fixture<UfCalendar>('<uf-calendar></uf-calendar>');
    const today = el.shadowRoot!.querySelector('td[aria-current="date"]')!;
    expect(today).not.toBeNull();
    expect(today.getAttribute('part')).toContain('today');
  });

  it('selects a day on click and fires change', async () => {
    const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" value="2026-10-14"></uf-calendar>');
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    cell(el, '2026-10-20').click();
    await el.updateComplete;
    expect(el.value).toBe('2026-10-20');
    expect(onChange).toHaveBeenCalledOnce();
    cell(el, '2026-10-20').click();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("selects the clicked day of the next or previous month, and shows that month", async () => {
    const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" value="2026-11-12"></uf-calendar>');
    // A real click: the pointer focuses the cell first, which used to move the grid under it.
    await userEvent.click(cell(el, '2026-12-03'));
    await el.updateComplete;
    expect(el.value).toBe('2026-12-03');
    expect(title(el)).toBe('December 2026');

    await userEvent.click(cell(el, '2026-11-30'));
    await el.updateComplete;
    expect(el.value).toBe('2026-11-30');
    expect(title(el)).toBe('November 2026');
  });

  it('moves with the keyboard: days, weeks, week ends, months and years', async () => {
    const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" value="2026-10-14"></uf-calendar>');
    await key(el, 'ArrowRight');
    expect(focused(el)).toBe('2026-10-15');
    await key(el, 'ArrowDown');
    expect(focused(el)).toBe('2026-10-22');
    await key(el, 'Home');
    expect(focused(el)).toBe('2026-10-18'); // Sunday, in en-US
    await key(el, 'End');
    expect(focused(el)).toBe('2026-10-24');
    await key(el, 'PageDown');
    expect(focused(el)).toBe('2026-11-24');
    expect(title(el)).toBe('November 2026');
    await key(el, 'PageUp', true);
    expect(focused(el)).toBe('2025-11-24');
    expect(el.shadowRoot!.activeElement?.getAttribute('data-date')).toBe('2025-11-24');
    await key(el, 'Enter');
    expect(el.value).toBe('2025-11-24');
  });

  it('changes month with the previous and next buttons', async () => {
    const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" value="2026-01-31"></uf-calendar>');
    nav(el, 1).click();
    await el.updateComplete;
    expect(title(el)).toBe('February 2026');
    nav(el, 0).click();
    nav(el, 0).click();
    await el.updateComplete;
    expect(title(el)).toBe('December 2025');
  });

  it('keeps within min and max, and disables days outside them', async () => {
    const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" value="2026-10-14" min="2026-10-10" max="2026-10-20"></uf-calendar>');
    expect(cell(el, '2026-10-09').getAttribute('aria-disabled')).toBe('true');
    expect(nav(el, 0).disabled).toBe(true);
    expect(nav(el, 1).disabled).toBe(true);
    await key(el, 'PageDown');
    expect(focused(el)).toBe('2026-10-20');
    cell(el, '2026-10-21').click();
    expect(el.value).toBe('2026-10-14');
  });

  it('disables dates with isDateDisabled', async () => {
    const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" value="2026-10-14"></uf-calendar>');
    el.isDateDisabled = (iso) => [0, 6].includes(new Date(iso).getUTCDay());
    await el.updateComplete;
    expect(cell(el, '2026-10-17').getAttribute('aria-disabled')).toBe('true');
    cell(el, '2026-10-17').click();
    expect(el.value).toBe('2026-10-14');
  });

  it('names its buttons, and translates them', async () => {
    const el = await fixture<UfCalendar>('<uf-calendar></uf-calendar>');
    expect(nav(el, 0).getAttribute('aria-label')).toBe('Previous month');
    expect(nav(el, 1).getAttribute('aria-label')).toBe('Next month');
  });

  it('has no axe violations', async () => {
    await fixture('<main><uf-calendar lang="en-US" value="2026-10-14" min="2026-10-05"></uf-calendar></main>');
    expect(await axeViolations()).toEqual([]);
  });

  it('moves focus with press() too', async () => {
    const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" value="2026-10-14"></uf-calendar>');
    el.focus();
    press(el.shadowRoot!.activeElement!, 'ArrowLeft');
    await el.updateComplete;
    expect(focused(el)).toBe('2026-10-13');
  });

  describe('range', () => {
    it('picks a start, then an end, and fires change once the range is complete', async () => {
      const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" range></uf-calendar>');
      el.min = '2026-10-01';
      await el.updateComplete;
      const onChange = vi.fn();
      el.addEventListener('change', onChange);
      cell(el, '2026-10-05').click();
      await el.updateComplete;
      expect([el.start, el.end]).toEqual(['2026-10-05', '']);
      expect(onChange).not.toHaveBeenCalled();
      cell(el, '2026-10-09').click();
      await el.updateComplete;
      expect([el.start, el.end]).toEqual(['2026-10-05', '2026-10-09']);
      expect(onChange).toHaveBeenCalledOnce();
    });

    it('swaps the dates when the end is picked before the start', async () => {
      const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" range start="2026-10-12"></uf-calendar>');
      cell(el, '2026-10-04').click();
      await el.updateComplete;
      expect([el.start, el.end]).toEqual(['2026-10-04', '2026-10-12']);
    });

    it('marks the ends and the days between, and selects them', async () => {
      const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" range start="2026-10-05" end="2026-10-08"></uf-calendar>');
      expect(cell(el, '2026-10-05').getAttribute('part')).toContain('range-start');
      expect(cell(el, '2026-10-06').getAttribute('part')).toContain('in-range');
      expect(cell(el, '2026-10-08').getAttribute('part')).toContain('range-end');
      expect(['04', '05', '06', '07', '08', '09'].map((d) => cell(el, `2026-10-${d}`).getAttribute('aria-selected'))).toEqual(['false', 'true', 'true', 'true', 'true', 'false']);
    });

    it('previews the range while the end is picked with the keyboard, and picks it with Enter', async () => {
      const el = await fixture<UfCalendar>('<uf-calendar lang="en-US" range></uf-calendar>');
      el.start = '2026-10-05';
      await el.updateComplete;
      await key(el, 'ArrowRight');
      await key(el, 'ArrowRight');
      expect(cell(el, '2026-10-06').getAttribute('part')).toContain('in-range');
      expect(cell(el, '2026-10-07').getAttribute('part')).toContain('range-end');
      await key(el, 'Enter');
      expect([el.start, el.end]).toEqual(['2026-10-05', '2026-10-07']);
    });

    it('has no axe violations with a range', async () => {
      await fixture('<main><uf-calendar lang="en-US" range start="2026-10-05" end="2026-10-12"></uf-calendar></main>');
      expect(await axeViolations()).toEqual([]);
    });
  });
});
