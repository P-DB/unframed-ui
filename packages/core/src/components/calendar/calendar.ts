import { LitElement, css, html, nothing, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { addDays, addMonths, clamp, firstDayOfWeek, formatter, parseIso, startOfMonth, toIso, todayIso } from '../../internal/dates.js';
import { defineElement } from '../../internal/define.js';
import { Translator } from '../../internal/i18n.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { focusRing, hostStyles } from '../../internal/shared.styles.js';
import { uniqueId } from '../../internal/slot.js';

/**
 * A month grid to pick a date. Arrow keys move by day and week, Page Up and
 * Page Down by month (with Shift, by year), Home and End to the start and end
 * of the week, Enter or Space selects. Month and weekday names, and the first
 * day of the week, follow the nearest `lang` attribute.
 *
 * Use it inline, e.g. for a booking page. For a form field, use
 * `<uf-date-picker>`, which opens one in a popup.
 *
 * @summary Shows a month to pick a date from.
 * @tag uf-calendar
 *
 * @event change - The user picked a date. Read it from `value`.
 *
 * @csspart base - The calendar.
 * @csspart header - The month title and the previous and next buttons.
 * @csspart title - The month and year.
 * @csspart nav-button - The previous and next month buttons.
 * @csspart grid - The `<table>` of days.
 * @csspart weekday - A weekday heading.
 * @csspart day - Every day.
 * @csspart selected - The selected day.
 * @csspart today - Today.
 *
 * @cssprop --uf-calendar-day-size - Width and height of a day.
 */
export class UfCalendar extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: inline-block;
        --_day: var(--uf-calendar-day-size, 2.25rem);
      }

      .base {
        display: inline-flex;
        flex-direction: column;
        gap: var(--uf-space-2);
        color: var(--uf-color-text);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-sm);
      }

      .header {
        display: flex;
        align-items: center;
        gap: var(--uf-space-1);
      }

      .title {
        flex: 1;
        margin: 0;
        font-size: var(--uf-font-size-md);
        font-weight: var(--uf-font-weight-semibold);
        text-align: center;
        text-transform: capitalize;
      }

      .nav {
        display: inline-grid;
        place-items: center;
        width: var(--_day);
        height: var(--_day);
        padding: 0;
        border: 0;
        border-radius: var(--uf-radius-control);
        background: transparent;
        color: var(--uf-color-text);
        cursor: pointer;
      }

      .nav:hover:not(:disabled) {
        background: var(--uf-color-accent-tint);
        color: var(--uf-color-on-accent-tint);
      }

      .nav:focus-visible {
        ${focusRing}
      }

      .nav:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .nav svg {
        width: 1.125em;
        height: 1.125em;
      }

      table {
        border-collapse: collapse;
      }

      th {
        width: var(--_day);
        height: 1.75rem;
        padding: 0;
        color: var(--uf-color-text-muted);
        font-weight: var(--uf-font-weight-medium);
        font-size: 0.75rem;
      }

      td {
        width: var(--_day);
        height: var(--_day);
        padding: 0;
        border-radius: var(--uf-radius-control);
        text-align: center;
        font-variant-numeric: tabular-nums;
        cursor: pointer;
        user-select: none;
      }

      td:hover:not([aria-disabled='true']) {
        background: var(--uf-color-accent-tint);
        color: var(--uf-color-on-accent-tint);
      }

      td:focus-visible {
        ${focusRing}
      }

      td.outside {
        color: var(--uf-color-text-muted);
      }

      td.today {
        font-weight: var(--uf-font-weight-semibold);
        box-shadow: inset 0 0 0 1px var(--uf-color-accent-strong);
      }

      td[aria-selected='true'],
      td[aria-selected='true']:hover {
        background: var(--uf-color-accent);
        color: var(--uf-color-on-accent);
        font-weight: var(--uf-font-weight-semibold);
      }

      td[aria-disabled='true'] {
        color: var(--uf-color-text-muted);
        text-decoration: line-through;
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    value: {},
    min: {},
    max: {},
    firstDayOfWeek: { type: Number, attribute: 'first-day-of-week' },
    isDateDisabled: { attribute: false },
  };

  /** The selected date, as `YYYY-MM-DD`, or an empty string. */
  declare value: string;
  /** The earliest date that can be picked, as `YYYY-MM-DD`. */
  declare min: string | undefined;
  /** The latest date that can be picked, as `YYYY-MM-DD`. */
  declare max: string | undefined;
  /** First day of the week: 0 Sunday … 6 Saturday. Defaults to the language's. */
  declare firstDayOfWeek: number | undefined;
  /** Rules out dates, e.g. weekends: called with each date as `YYYY-MM-DD`, returns true to disable it. */
  declare isDateDisabled: ((date: string) => boolean) | undefined;

  readonly #translator = new Translator(this);
  readonly #id = uniqueId('uf-calendar');
  /** The day with keyboard focus; its month is the one shown. */
  #focused: Date = parseIso(todayIso())!;
  /** Focus the focused day after the next render (keyboard navigation). */
  #moveFocus = false;

  constructor() {
    super();
    this.value = '';
  }

  override willUpdate(changed: PropertyValues<this>): void {
    // Show the selected date's month when the value changes from outside.
    if (changed.has('value') || changed.has('min') || changed.has('max')) {
      const selected = parseIso(this.value);
      this.#focused = clamp(selected ?? this.#focused, parseIso(this.min), parseIso(this.max));
    }
  }

  override updated(): void {
    if (this.#moveFocus) {
      this.#moveFocus = false;
      this.#focusedCell()?.focus();
    }
  }

  /** Moves keyboard focus to the selected day, or today. */
  override focus(options?: FocusOptions): void {
    this.#focusedCell()?.focus(options);
  }

  #focusedCell(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(`td[data-date="${toIso(this.#focused)}"]`);
  }

  #isDisabled(date: Date): boolean {
    const min = parseIso(this.min);
    const max = parseIso(this.max);
    return Boolean((min && date < min) || (max && date > max) || this.isDateDisabled?.(toIso(date)));
  }

  #moveTo(date: Date, focus: boolean): void {
    this.#focused = clamp(date, parseIso(this.min), parseIso(this.max));
    this.#moveFocus = focus;
    this.requestUpdate();
  }

  #select(date: Date): void {
    if (this.#isDisabled(date)) return;
    this.#focused = date;
    const iso = toIso(date);
    if (iso === this.value) return;
    this.value = iso;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  #onKeyDown = (event: KeyboardEvent): void => {
    const date = this.#focused;
    const weekStart = this.#weekStart;
    const offset = (date.getUTCDay() - weekStart + 7) % 7;
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(date, getComputedStyle(this).direction === 'rtl' ? 1 : -1),
      ArrowRight: () => addDays(date, getComputedStyle(this).direction === 'rtl' ? -1 : 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      Home: () => addDays(date, -offset),
      End: () => addDays(date, 6 - offset),
      PageUp: () => addMonths(date, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(date, event.shiftKey ? 12 : 1),
    };
    if (moves[event.key]) {
      event.preventDefault();
      this.#moveTo(moves[event.key](), true);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#select(date);
    }
  };

  get #weekStart(): number {
    return this.firstDayOfWeek ?? firstDayOfWeek(this.#translator.lang);
  }

  override render() {
    const lang = this.#translator.lang;
    const weekStart = this.#weekStart;
    const month = startOfMonth(this.#focused);
    const first = addDays(month, -((month.getUTCDay() - weekStart + 7) % 7));
    // Always six weeks, so the calendar keeps its height from month to month.
    const days = Array.from({ length: 42 }, (_, i) => addDays(first, i));
    const weekdays = days.slice(0, 7);
    const min = parseIso(this.min);
    const max = parseIso(this.max);
    const today = todayIso();
    const titleId = `${this.#id}-title`;
    const long = formatter(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return html`<div class="base" part="base">
      <div class="header" part="header">
        <button
          class="nav"
          part="nav-button"
          type="button"
          aria-label=${this.#translator.t('previousMonth')}
          ?disabled=${Boolean(min && addDays(month, -1) < min)}
          @click=${() => this.#moveTo(addMonths(this.#focused, -1), false)}
        >
          ${iconSvg(icons['chevron-left'])}
        </button>
        <h2 id=${titleId} class="title" part="title" aria-live="polite">${formatter(lang, { month: 'long', year: 'numeric' }).format(month)}</h2>
        <button
          class="nav"
          part="nav-button"
          type="button"
          aria-label=${this.#translator.t('nextMonth')}
          ?disabled=${Boolean(max && addMonths(month, 1) > max)}
          @click=${() => this.#moveTo(addMonths(this.#focused, 1), false)}
        >
          ${iconSvg(icons['chevron-right'])}
        </button>
      </div>
      <table role="grid" part="grid" aria-labelledby=${titleId} @keydown=${this.#onKeyDown}>
        <thead>
          <tr>
            ${weekdays.map(
              (day) =>
                html`<th scope="col" part="weekday" abbr=${formatter(lang, { weekday: 'long' }).format(day)}>
                  ${formatter(lang, { weekday: 'narrow' }).format(day)}
                </th>`,
            )}
          </tr>
        </thead>
        <tbody>
          ${[0, 1, 2, 3, 4, 5].map(
            (week) => html`<tr>
              ${days.slice(week * 7, week * 7 + 7).map((day) => {
                const iso = toIso(day);
                const selected = iso === this.value;
                const isToday = iso === today;
                const disabled = this.#isDisabled(day);
                const parts = ['day', selected ? 'selected' : '', isToday ? 'today' : ''].filter(Boolean).join(' ');
                return html`<td
                  part=${parts}
                  class=${classMap({ outside: day.getUTCMonth() !== month.getUTCMonth(), today: isToday })}
                  data-date=${iso}
                  tabindex=${iso === toIso(this.#focused) ? 0 : -1}
                  aria-label=${long.format(day)}
                  aria-selected=${selected ? 'true' : 'false'}
                  aria-disabled=${disabled ? 'true' : nothing}
                  aria-current=${isToday ? 'date' : nothing}
                  @click=${() => this.#select(day)}
                  @focus=${() => {
                    if (toIso(this.#focused) !== iso) this.#moveTo(day, false);
                  }}
                >
                  ${day.getUTCDate()}
                </td>`;
              })}
            </tr>`,
          )}
        </tbody>
      </table>
    </div>`;
  }
}

defineElement('uf-calendar', UfCalendar);

declare global {
  interface HTMLElementTagNameMap {
    'uf-calendar': UfCalendar;
  }
}
