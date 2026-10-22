import { css, html, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { formatShort, formatter, parseIso, parseTyped, shortPattern, toIso, todayIso } from '../../internal/dates.js';
import { defineElement } from '../../internal/define.js';
import { controlBoxStyles, describedBy, fieldStyles, renderField, type FieldSize } from '../../internal/field.js';
import { FormControl } from '../../internal/form-control.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { autoUpdate, positionFloating } from '../../internal/position.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';
import '../calendar/calendar.js';
import type { UfCalendar } from '../calendar/calendar.js';

type End = 'start' | 'end';

/** A browser-translated "Please fill out this field.", from a native input that never joins the page. */
let requiredMessage: string | undefined;
function valueMissingMessage(): string {
  if (requiredMessage === undefined) {
    const probe = document.createElement('input');
    probe.required = true;
    requiredMessage = probe.validationMessage;
  }
  return requiredMessage;
}

/** Splits an ISO 8601 interval, `YYYY-MM-DD/YYYY-MM-DD`, into its two valid dates (or empty strings). */
function splitInterval(value: string | null | undefined): [string, string] {
  const [start = '', end = ''] = (value ?? '').split('/');
  return [parseIso(start) ? start : '', parseIso(end) ? end : ''];
}

/**
 * A date range field: type the start and end dates in the page language's
 * format, or pick both from a calendar. The value is an ISO 8601 interval,
 * `YYYY-MM-DD/YYYY-MM-DD`, the same in every language, and it submits with the
 * form; `start` and `end` hold the two dates.
 *
 * Alt + Down Arrow opens the calendar; Escape closes it.
 *
 * @summary Lets users type or pick a start and an end date.
 * @tag uf-date-range-picker
 *
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the field. Overrides `hint`.
 *
 * @event input - The range changed (a date was typed and committed, or both were picked).
 * @event change - The range changed (a date was typed and committed, or both were picked).
 * @event uf-show - The calendar opened.
 * @event uf-hide - The calendar closed.
 *
 * @csspart field - The wrapper around label, control, hint and error.
 * @csspart form-label - The label.
 * @csspart box - The bordered box around the inputs.
 * @csspart start-input - The start date input.
 * @csspart end-input - The end date input.
 * @csspart separator - The dash between the two inputs.
 * @csspart toggle - The calendar button.
 * @csspart popup - The floating panel around the calendar.
 * @csspart calendar - The `<uf-calendar>`.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-field-bg - Background of the box.
 * @cssprop --uf-field-border-color - Border color of the box.
 * @cssprop --uf-field-radius - Corner radius of the box.
 *
 * @cssstate user-invalid - The range is invalid and the user has interacted with the field.
 */
export class UfDateRangePicker extends FormControl {
  static override styles = [
    hostStyles,
    fieldStyles,
    controlBoxStyles,
    css`
      .box {
        padding-inline-end: 0;
      }

      .native {
        width: 0;
        text-align: center;
      }

      .separator {
        flex: none;
        color: var(--uf-color-text-muted);
      }

      .toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        width: calc(var(--_height) - 2px);
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--uf-color-text-muted);
        cursor: pointer;
      }

      .toggle:hover:not(:disabled),
      .toggle.open {
        color: var(--uf-color-accent-strong);
      }

      .toggle:focus-visible {
        outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
        outline-offset: -2px;
      }

      .toggle:disabled {
        cursor: not-allowed;
      }

      .toggle .icon {
        width: 1.125em;
        height: 1.125em;
      }

      .popup {
        position: fixed;
        inset: auto;
        margin: 0;
        padding: var(--uf-space-3);
        border: 1px solid var(--uf-color-border);
        border-radius: var(--uf-radius-md);
        background: var(--uf-color-surface-overlay);
        color: var(--uf-color-text);
        box-shadow: var(--uf-shadow-overlay);
      }
    `,
  ];

  protected static override formStateProperties: ReadonlySet<PropertyKey> = new Set([
    ...FormControl.formStateProperties,
    'start',
    'end',
    'min',
    'max',
    'isDateDisabled',
  ]);

  static override properties: PropertyDeclarations = {
    value: { attribute: false, noAccessor: true },
    start: { attribute: false },
    end: { attribute: false },
    defaultValue: { attribute: 'value' },
    label: {},
    hint: {},
    placeholder: {},
    size: { reflect: true },
    min: {},
    max: {},
    readonly: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
    isDateDisabled: { attribute: false },
  };

  /** The first date of the range, as `YYYY-MM-DD`, or an empty string. */
  declare start: string;
  /** The last date of the range, as `YYYY-MM-DD`, or an empty string. */
  declare end: string;
  /** Initial range, restored on form reset. Set with the `value` attribute, as `YYYY-MM-DD/YYYY-MM-DD`. */
  declare defaultValue: string;
  /** The field's label, also its accessible name. */
  declare label: string | undefined;
  /** Help text below the field. */
  declare hint: string | undefined;
  /** Shown in both inputs when empty. Defaults to the date format, e.g. dd/mm/yyyy. */
  declare placeholder: string | undefined;
  /** Size: `sm`, `md` or `lg`. */
  declare size: FieldSize;
  /** The earliest allowed date, as `YYYY-MM-DD`. */
  declare min: string | undefined;
  /** The latest allowed date, as `YYYY-MM-DD`. */
  declare max: string | undefined;
  /** Lets the user select the text but not change the dates. */
  declare readonly: boolean;
  /** Whether the calendar is open. */
  declare open: boolean;
  /** Rules out dates, e.g. weekends: called with each date as `YYYY-MM-DD`, returns true to disable it. */
  declare isDateDisabled: ((date: string) => boolean) | undefined;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-date-range-picker');
  /** What the user typed in each input and hasn't committed yet; null shows the date, formatted. */
  #text: Record<End, string | null> = { start: null, end: null };
  /** The committed text of an input isn't a date. */
  #bad: Record<End, boolean> = { start: false, end: false };
  #cleanup?: () => void;
  #focusWasInside = false;
  #toggling = false;

  constructor() {
    super();
    this.start = '';
    this.end = '';
    this.defaultValue = '';
    this.size = 'md';
    this.readonly = false;
    this.open = false;
  }

  /** The range as an ISO 8601 interval, `YYYY-MM-DD/YYYY-MM-DD`, or an empty string until both dates are set. */
  get value(): string {
    return this.start && this.end ? `${this.start}/${this.end}` : '';
  }

  set value(value: string) {
    const old = this.value;
    [this.start, this.end] = splitInterval(value);
    this.requestUpdate('value', old);
  }

  #input(which: End): HTMLInputElement | null {
    return this.renderRoot.querySelector(`[data-end="${which}"]`);
  }

  get #popup(): HTMLElement | null {
    return this.renderRoot.querySelector('.popup');
  }

  get #calendar(): UfCalendar | null {
    return this.renderRoot.querySelector('uf-calendar');
  }

  /** Opens the calendar. */
  show(): void {
    if (!this.isDisabled && !this.readonly) this.open = true;
  }

  /** Closes the calendar. */
  hide(): void {
    this.open = false;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#cleanup?.();
    this.#cleanup = undefined;
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultValue') && this.value === splitInterval(changed.get('defaultValue')).filter(Boolean).join('/')) {
      [this.start, this.end] = splitInterval(this.defaultValue);
    }
    // Dates set from code replace what was typed.
    for (const which of ['start', 'end'] as const) {
      if (changed.has(which)) {
        this.#text[which] = null;
        this.#bad[which] = false;
      }
    }
  }

  override updated(changed: PropertyValues<this>): void {
    this.syncFormState();
    if (changed.has('open')) this.#syncPopup();
  }

  #syncPopup(): void {
    const popup = this.#popup;
    if (!popup || this.#toggling) return;
    if (this.open && !popup.matches(':popover-open')) {
      popup.showPopover();
      this.#startPositioning();
    } else if (!this.open && popup.matches(':popover-open')) {
      popup.hidePopover();
    }
  }

  #startPositioning(): void {
    const popup = this.#popup;
    const box = this.renderRoot.querySelector<HTMLElement>('.box');
    if (!popup || !box || !popup.matches(':popover-open')) return;
    this.#cleanup ??= autoUpdate(box, popup, () => positionFloating(box, popup, 'bottom-start', 4));
  }

  #onBeforeToggle = (event: ToggleEvent): void => {
    // Same as <uf-date-picker>: keeps `open` right at once, and positions the
    // popup before its first paint.
    this.#toggling = true;
    this.open = event.newState === 'open';
    if (event.newState === 'open') requestAnimationFrame(() => this.#startPositioning());
    if (event.newState === 'closed') this.#focusWasInside = Boolean(this.shadowRoot?.activeElement?.closest('.popup'));
  };

  #onToggle = (event: ToggleEvent): void => {
    this.#toggling = false;
    // Closed (or reopened) from code before the browser finished: catch up now.
    if ((event.newState === 'open') !== this.open) {
      this.#syncPopup();
      return;
    }
    if (event.newState === 'open') {
      this.#startPositioning();
      this.#calendar?.updateComplete.then(() => this.#calendar?.focus());
      this.dispatchEvent(new Event('uf-show', { bubbles: true, composed: true }));
    } else {
      this.#cleanup?.();
      this.#cleanup = undefined;
      if (this.#focusWasInside) this.#input('start')?.focus();
      this.#focusWasInside = false;
      this.dispatchEvent(new Event('uf-hide', { bubbles: true, composed: true }));
    }
  };

  protected syncFormState(): void {
    const startInput = this.#input('start');
    const endInput = this.#input('end');
    if (!startInput || !endInput) return;
    this.internals.setFormValue(this.value);
    const t = this.translator;
    const lang = t.lang;
    const start = parseIso(this.start);
    const end = parseIso(this.end);
    const min = parseIso(this.min);
    const max = parseIso(this.max);
    const long = (d: Date) => formatter(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    const example = () => t.t('invalidDate', { example: formatShort(parseIso(todayIso())!, lang) });

    if (this.#bad.start || this.#bad.end) {
      this.setValidity({ badInput: true }, example(), this.#bad.start ? startInput : endInput);
    } else if (this.required && !start && !end) {
      this.setValidity({ valueMissing: true }, valueMissingMessage(), startInput);
    } else if (Boolean(start) !== Boolean(end)) {
      this.setValidity({ badInput: true }, t.t('rangeIncomplete'), start ? endInput : startInput);
    } else if (start && end && end < start) {
      this.setValidity({ badInput: true }, t.t('endBeforeStart'), endInput);
    } else if (start && min && start < min) {
      this.setValidity({ rangeUnderflow: true }, t.t('dateTooEarly', { date: long(min) }), startInput);
    } else if (end && max && end > max) {
      this.setValidity({ rangeOverflow: true }, t.t('dateTooLate', { date: long(max) }), endInput);
    } else if (start && this.isDateDisabled?.(this.start)) {
      this.setValidity({ badInput: true }, t.t('dateUnavailable'), startInput);
    } else if (end && this.isDateDisabled?.(this.end)) {
      this.setValidity({ badInput: true }, t.t('dateUnavailable'), endInput);
    } else {
      this.setValidity({}, '', startInput);
    }
  }

  protected resetValue(): void {
    [this.start, this.end] = splitInterval(this.defaultValue);
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    [this.start, this.end] = splitInterval(state);
  }

  /** Sets the dates from the user, and tells listeners when they changed. */
  #commit(start: string, end: string): void {
    const changed = start !== this.start || end !== this.end;
    this.start = start;
    this.end = end;
    this.markInteracted();
    if (changed) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.emitChange();
    }
  }

  /** Turns the typed text of one input into its date: a date, empty, or invalid. */
  #commitText(which: End): void {
    const typed = this.#text[which];
    if (typed === null) return;
    const text = typed.trim();
    const date = text ? parseTyped(text, this.translator.lang) : null;
    const iso = date ? toIso(date) : '';
    this.#commit(which === 'start' ? iso : this.start, which === 'end' ? iso : this.end);
    // Not a date: keep the text so the user can fix it, and report it.
    this.#text[which] = text && !date ? text : null;
    this.#bad[which] = Boolean(text && !date);
    this.syncFormState();
    this.requestUpdate();
  }

  #onInput = (which: End) => (event: Event) => {
    // The dates change when committed, not on every keystroke.
    event.stopPropagation();
    this.#text[which] = (event.target as HTMLInputElement).value;
  };

  #onKeyDown = (which: End) => (event: KeyboardEvent) => {
    if (event.key === 'Enter') this.#commitText(which);
    else if (event.key === 'ArrowDown' && event.altKey) {
      event.preventDefault();
      this.show();
    }
  };

  #onCalendarChange = (event: Event): void => {
    event.stopPropagation();
    const calendar = event.target as UfCalendar;
    this.#commit(calendar.start, calendar.end);
    this.hide();
    this.#input('end')?.focus();
  };

  #placeholder(): string {
    if (this.placeholder !== undefined) return this.placeholder;
    const { order, separator } = shortPattern(this.translator.lang);
    const letters = { day: this.translator.t('dayPlaceholder'), month: this.translator.t('monthPlaceholder'), year: this.translator.t('yearPlaceholder') };
    return order.map((part) => letters[part]).join(separator);
  }

  #renderInput(which: End, ids: { hintId: string; errorId: string }, error: string, hasHintSlot: boolean) {
    const date = parseIso(this[which]);
    const text = this.#text[which] ?? (date ? formatShort(date, this.translator.lang) : '');
    const name = this.translator.t(which === 'start' ? 'startDate' : 'endDate');
    return html`<input
      id=${which === 'start' ? this.#id : `${this.#id}-end`}
      class="native"
      part=${`${which}-input`}
      data-end=${which}
      type="text"
      autocomplete="off"
      .value=${live(text)}
      placeholder=${this.#placeholder()}
      aria-label=${this.label ? `${this.label}, ${name}` : name}
      ?readonly=${this.readonly}
      ?disabled=${this.isDisabled}
      aria-required=${this.required ? 'true' : 'false'}
      aria-invalid=${error ? 'true' : 'false'}
      aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
      @input=${this.#onInput(which)}
      @change=${() => this.#commitText(which)}
      @keydown=${this.#onKeyDown(which)}
    />`;
  }

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const popupId = `${this.#id}-popup`;
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');

    return renderField({
      ...ids,
      controlId: this.#id,
      label: this.label,
      hasLabelSlot: this.#slots.has('label'),
      hint: this.hint,
      hasHintSlot,
      error,
      required: this.required,
      control: html`
        <div class=${classMap({ box: true, disabled: this.isDisabled })} part="box">
          ${this.#renderInput('start', ids, error, hasHintSlot)}
          <span class="separator" part="separator" aria-hidden="true">–</span>
          ${this.#renderInput('end', ids, error, hasHintSlot)}
          <button
            class=${classMap({ toggle: true, open: this.open })}
            part="toggle"
            type="button"
            aria-label=${this.translator.t('chooseDates')}
            aria-haspopup="dialog"
            aria-expanded=${this.open ? 'true' : 'false'}
            popovertarget=${popupId}
            ?disabled=${this.isDisabled || this.readonly}
          >
            ${iconSvg(icons.calendar)}
          </button>
        </div>
        <div
          id=${popupId}
          class="popup"
          part="popup"
          popover="auto"
          role="dialog"
          aria-label=${this.label ?? this.translator.t('chooseDates')}
          @beforetoggle=${this.#onBeforeToggle}
          @toggle=${this.#onToggle}
        >
          <uf-calendar
            part="calendar"
            range
            .start=${live(this.start)}
            .end=${live(this.end)}
            .min=${this.min}
            .max=${this.max}
            .isDateDisabled=${this.isDateDisabled}
            @change=${this.#onCalendarChange}
          ></uf-calendar>
        </div>
      `,
    });
  }
}

defineElement('uf-date-range-picker', UfDateRangePicker);

declare global {
  interface HTMLElementTagNameMap {
    'uf-date-range-picker': UfDateRangePicker;
  }
}
