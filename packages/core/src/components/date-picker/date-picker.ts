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

/**
 * A date field: type a date in the page language's format, or pick one from a
 * calendar. The value is always `YYYY-MM-DD`, like `<input type="date">`, so
 * it's the same in every language and submits with the form.
 *
 * Alt + Down Arrow opens the calendar; Escape closes it.
 *
 * @summary Lets users type or pick a date.
 * @tag uf-date-picker
 *
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the field. Overrides `hint`.
 *
 * @event input - The value changed (a date was typed and committed, or picked).
 * @event change - The value changed (a date was typed and committed, or picked).
 * @event uf-show - The calendar opened.
 * @event uf-hide - The calendar closed.
 *
 * @csspart field - The wrapper around label, control, hint and error.
 * @csspart form-label - The label.
 * @csspart box - The bordered box around the input.
 * @csspart input - The text input.
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
 * @cssstate user-invalid - The value is invalid and the user has interacted with the field.
 */
export class UfDatePicker extends FormControl {
  static override styles = [
    hostStyles,
    fieldStyles,
    controlBoxStyles,
    css`
      .box {
        padding-inline-end: 0;
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
    'min',
    'max',
    'isDateDisabled',
  ]);

  static override properties: PropertyDeclarations = {
    value: { attribute: false },
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

  /** The date, as `YYYY-MM-DD`, or an empty string. */
  declare value: string;
  /** Initial date, restored on form reset. Set with the `value` attribute, as `YYYY-MM-DD`. */
  declare defaultValue: string;
  /** The field's label, also its accessible name. */
  declare label: string | undefined;
  /** Help text below the field. */
  declare hint: string | undefined;
  /** Shown when empty. Defaults to the date format, e.g. dd/mm/yyyy. */
  declare placeholder: string | undefined;
  /** Size: `sm`, `md` or `lg`. */
  declare size: FieldSize;
  /** The earliest allowed date, as `YYYY-MM-DD`. */
  declare min: string | undefined;
  /** The latest allowed date, as `YYYY-MM-DD`. */
  declare max: string | undefined;
  /** Lets the user select the text but not change the date. */
  declare readonly: boolean;
  /** Whether the calendar is open. */
  declare open: boolean;
  /** Rules out dates, e.g. weekends: called with each date as `YYYY-MM-DD`, returns true to disable it. */
  declare isDateDisabled: ((date: string) => boolean) | undefined;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-date-picker');
  /** What the user typed and hasn't committed yet; null shows the value, formatted. */
  #text: string | null = null;
  /** The committed text isn't a date. */
  #badInput = false;
  #cleanup?: () => void;
  /** Focus was in the calendar when it closed: give it back to the input. */
  #focusWasInside = false;
  /** Between beforetoggle and toggle. */
  #toggling = false;

  constructor() {
    super();
    this.value = '';
    this.defaultValue = '';
    this.size = 'md';
    this.readonly = false;
    this.open = false;
  }

  get #input(): HTMLInputElement | null {
    return this.renderRoot.querySelector('input');
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
    if (changed.has('defaultValue') && this.value === (changed.get('defaultValue') ?? '')) {
      this.value = parseIso(this.defaultValue) ? this.defaultValue : '';
    }
    // A value set from code replaces what was typed.
    if (changed.has('value')) {
      this.#text = null;
      this.#badInput = false;
    }
  }

  override updated(changed: PropertyValues<this>): void {
    this.syncFormState();
    if (changed.has('open')) this.#syncPopup();
  }

  #syncPopup(): void {
    const popup = this.#popup;
    // The browser is opening or closing it already (button, Escape, click outside).
    if (!popup || this.#toggling) return;
    if (this.open && !popup.matches(':popover-open')) {
      popup.showPopover();
      // Positioned in the same task, so it never paints at its default spot.
      this.#startPositioning();
    } else if (!this.open && popup.matches(':popover-open')) {
      popup.hidePopover();
    }
  }

  /** Places the popup under the field, and keeps it there on scroll and resize. */
  #startPositioning(): void {
    const popup = this.#popup;
    const box = this.renderRoot.querySelector<HTMLElement>('.box');
    if (!popup || !box || !popup.matches(':popover-open')) return;
    this.#cleanup ??= autoUpdate(box, popup, () => positionFloating(box, popup, 'bottom-start', 4));
  }

  /**
   * The popup opened or closed, however it happened: the button (linked with
   * popovertarget, so a click while open closes it instead of reopening),
   * Escape, a click outside, or \`open\`.
   */
  #onBeforeToggle = (event: ToggleEvent): void => {
    // Synchronous, so \`open\` is right as soon as the popup opens or closes.
    // Lit may render before the browser finishes: #toggling keeps #syncPopup
    // from calling showPopover/hidePopover in the middle, which would cancel
    // the toggle event.
    this.#toggling = true;
    this.open = event.newState === 'open';
    // Opened by the button: the browser shows it after this event, and the
    // toggle event comes a task later, after a paint. An animation frame runs
    // after it's shown and before that paint, so position it there.
    if (event.newState === 'open') requestAnimationFrame(() => this.#startPositioning());
    // Before it hides: afterwards the browser has already moved focus away.
    if (event.newState === 'closed') this.#focusWasInside = Boolean(this.shadowRoot?.activeElement?.closest('.popup'));
  };

  #onToggle = (event: ToggleEvent): void => {
    this.#toggling = false;
    if (event.newState === 'open') {
      this.#startPositioning();
      this.#calendar?.updateComplete.then(() => this.#calendar?.focus());
      this.dispatchEvent(new Event('uf-show', { bubbles: true, composed: true }));
    } else {
      this.#cleanup?.();
      this.#cleanup = undefined;
      if (this.#focusWasInside) this.#input?.focus();
      this.#focusWasInside = false;
      this.dispatchEvent(new Event('uf-hide', { bubbles: true, composed: true }));
    }
  };

  protected syncFormState(): void {
    const input = this.#input;
    if (!input) return;
    this.internals.setFormValue(this.value);
    const t = this.translator;
    const lang = t.lang;
    const date = parseIso(this.value);
    const min = parseIso(this.min);
    const max = parseIso(this.max);
    const long = (d: Date) => formatter(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);

    if (this.#badInput) {
      this.setValidity({ badInput: true }, t.t('invalidDate', { example: formatShort(parseIso(todayIso())!, lang) }), input);
    } else if (this.required && !date) {
      this.setValidity({ valueMissing: true }, valueMissingMessage(), input);
    } else if (date && min && date < min) {
      this.setValidity({ rangeUnderflow: true }, t.t('dateTooEarly', { date: long(min) }), input);
    } else if (date && max && date > max) {
      this.setValidity({ rangeOverflow: true }, t.t('dateTooLate', { date: long(max) }), input);
    } else if (date && this.isDateDisabled?.(this.value)) {
      this.setValidity({ badInput: true }, t.t('dateUnavailable'), input);
    } else {
      this.setValidity({}, '', input);
    }
  }

  protected resetValue(): void {
    this.value = parseIso(this.defaultValue) ? this.defaultValue : '';
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    this.value = parseIso(state) ? state! : '';
  }

  /** Sets the value from the user, and tells listeners when it changed. */
  #commit(value: string): void {
    const changed = value !== this.value;
    this.value = value;
    this.markInteracted();
    if (changed) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.emitChange();
    }
  }

  /** Turns the typed text into the value: a date, empty, or invalid. */
  #commitText(): void {
    if (this.#text === null) return;
    const text = this.#text.trim();
    const date = text ? parseTyped(text, this.translator.lang) : null;
    if (!text || date) {
      this.#commit(date ? toIso(date) : '');
      this.#text = null;
      this.#badInput = false;
    } else {
      // Not a date: keep the text so the user can fix it, and report it.
      this.#commit('');
      this.#text = text;
      this.#badInput = true;
    }
    this.syncFormState();
    this.requestUpdate();
  }

  #onInput = (event: Event): void => {
    // The value changes when the date is committed, not on every keystroke.
    event.stopPropagation();
    this.#text = (event.target as HTMLInputElement).value;
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') this.#commitText();
    else if (event.key === 'ArrowDown' && event.altKey) {
      event.preventDefault();
      this.show();
    }
  };

  #onCalendarChange = (event: Event): void => {
    event.stopPropagation();
    this.#commit((event.target as UfCalendar).value);
    this.hide();
    this.#input?.focus();
  };

  #placeholder(): string {
    if (this.placeholder !== undefined) return this.placeholder;
    const { order, separator } = shortPattern(this.translator.lang);
    const letters = { day: this.translator.t('dayPlaceholder'), month: this.translator.t('monthPlaceholder'), year: this.translator.t('yearPlaceholder') };
    return order.map((part) => letters[part]).join(separator);
  }

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const popupId = `${this.#id}-popup`;
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');
    const date = parseIso(this.value);
    const text = this.#text ?? (date ? formatShort(date, this.translator.lang) : '');

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
          <input
            id=${this.#id}
            class="native"
            part="input"
            type="text"
            autocomplete="off"
            .value=${live(text)}
            placeholder=${this.#placeholder()}
            ?readonly=${this.readonly}
            ?disabled=${this.isDisabled}
            aria-required=${this.required ? 'true' : 'false'}
            aria-invalid=${error ? 'true' : 'false'}
            aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
            @input=${this.#onInput}
            @change=${() => this.#commitText()}
            @keydown=${this.#onKeyDown}
          />
          <button
            class=${classMap({ toggle: true, open: this.open })}
            part="toggle"
            type="button"
            aria-label=${this.translator.t('chooseDate')}
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
          aria-label=${this.label ?? this.translator.t('chooseDate')}
          @beforetoggle=${this.#onBeforeToggle}
          @toggle=${this.#onToggle}
        >
          <uf-calendar
            part="calendar"
            .value=${this.value}
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

defineElement('uf-date-picker', UfDatePicker);

declare global {
  interface HTMLElementTagNameMap {
    'uf-date-picker': UfDatePicker;
  }
}
