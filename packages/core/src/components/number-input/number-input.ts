import { css, html, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { defineElement } from '../../internal/define.js';
import { controlBoxStyles, describedBy, fieldStyles, renderField, type FieldSize } from '../../internal/field.js';
import { FormControl } from '../../internal/form-control.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { submitOnEnter } from '../../internal/implicit-submission.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';

/** An attribute that may be missing or empty, as a number or `null`. */
const optionalNumber = {
  fromAttribute: (value: string | null) => (value === null || value.trim() === '' ? null : Number(value)),
  toAttribute: (value: number | null) => (value === null ? null : String(value)),
};

/**
 * A field for a number, with buttons to step it down and up. The value is a
 * number, or `null` while the field is empty. Arrow keys step it too, Enter
 * submits the form, and `min`, `max` and `step` validate it like a native
 * number input.
 *
 * The buttons are out of the tab order: arrow keys do the same from the field.
 *
 * @summary Lets users enter a number, or step it with buttons.
 * @tag uf-number-input
 *
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the field. Overrides `hint`.
 * @slot prefix - An icon or text before the number, like a currency.
 * @slot suffix - An icon or text after the number, like a unit.
 *
 * @event input - Fired on every keystroke and every step.
 * @event change - Fired when the value is committed: blur, Enter or a step.
 *
 * @csspart field - The wrapper around label, control, hint and error.
 * @csspart form-label - The label.
 * @csspart box - The bordered box around the input and the buttons.
 * @csspart input - The native `<input type="number">`.
 * @csspart steppers - The wrapper around the two buttons.
 * @csspart decrement - The minus button.
 * @csspart increment - The plus button.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-field-bg - Background of the box.
 * @cssprop --uf-field-border-color - Border color of the box.
 * @cssprop --uf-field-radius - Corner radius of the box.
 *
 * @cssstate user-invalid - The value is invalid and the user has interacted with the field.
 */
export class UfNumberInput extends FormControl {
  static override styles = [
    hostStyles,
    fieldStyles,
    controlBoxStyles,
    css`
      /* The buttons fill the box's height, flush with its right edge. */
      .box {
        padding-inline-end: 0;
      }

      .native {
        font-variant-numeric: tabular-nums;
        -moz-appearance: textfield;
      }

      /* The buttons replace the browser's spinners. */
      .native::-webkit-inner-spin-button,
      .native::-webkit-outer-spin-button {
        margin: 0;
        -webkit-appearance: none;
      }

      .steppers {
        display: flex;
        flex: none;
        align-self: stretch;
      }

      .step {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--_height);
        padding: 0;
        border: 0;
        border-inline-start: 1px solid var(--uf-color-border);
        background: transparent;
        color: var(--uf-color-text-muted);
        cursor: pointer;
        transition:
          background-color var(--uf-duration-fast) ease,
          color var(--uf-duration-fast) ease;
      }

      .step:hover:not(:disabled) {
        background: var(--uf-color-surface-hover);
        color: var(--uf-color-text);
      }

      .step:active:not(:disabled) {
        background: var(--uf-color-surface-active);
      }

      .step:disabled {
        color: var(--uf-color-border-strong);
        cursor: not-allowed;
      }

      .step .icon {
        width: 1em;
        height: 1em;
      }
    `,
  ];

  protected static override formStateProperties: ReadonlySet<PropertyKey> = new Set([
    ...FormControl.formStateProperties,
    'readonly',
    'min',
    'max',
    'step',
  ]);

  static override properties: PropertyDeclarations = {
    value: { attribute: false },
    defaultValue: { attribute: 'value', converter: optionalNumber },
    label: {},
    hint: {},
    placeholder: {},
    size: { reflect: true },
    readonly: { type: Boolean, reflect: true },
    min: { converter: optionalNumber },
    max: { converter: optionalNumber },
    step: { type: Number },
  };

  /** Current value, or `null` while the field is empty. */
  declare value: number | null;
  /** Initial value, restored on form reset. Set with the `value` attribute. */
  declare defaultValue: number | null;
  /** Visible label. */
  declare label: string | undefined;
  /** Help text below the field. */
  declare hint: string | undefined;
  /** Placeholder text. */
  declare placeholder: string | undefined;
  /** Size of the field. */
  declare size: FieldSize;
  /** Makes the field read-only, without the buttons doing anything. */
  declare readonly: boolean;
  /** Lowest value. */
  declare min: number | null;
  /** Highest value. */
  declare max: number | null;
  /** The buttons and arrow keys move by this much, and the value must be a multiple of it (from `min`). */
  declare step: number;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-number-input');
  /** The text in the field, kept as typed: "1.50" stays "1.50", not the number's "1.5". */
  #text = '';

  constructor() {
    super();
    this.value = null;
    this.defaultValue = null;
    this.size = 'md';
    this.readonly = false;
    this.min = null;
    this.max = null;
    this.step = 1;
  }

  get #input(): HTMLInputElement | null {
    return this.renderRoot.querySelector('input');
  }

  /** Steps the value up by `step` (or `count` steps), like the plus button. */
  stepUp(count = 1): void {
    this.#step(count);
  }

  /** Steps the value down by `step` (or `count` steps), like the minus button. */
  stepDown(count = 1): void {
    this.#step(-count);
  }

  override willUpdate(changed: PropertyValues<this>): void {
    // Like a native input: the value follows the `value` attribute until it is edited.
    if (changed.has('defaultValue') && this.value === (changed.get('defaultValue') ?? null)) {
      this.value = this.defaultValue ?? null;
    }
    // A value set from code replaces the text; one the user typed keeps it.
    if (changed.has('value') && toNumber(this.#text) !== this.value) {
      this.#text = this.value === null || Number.isNaN(this.value) ? '' : String(this.value);
    }
  }

  override updated(): void {
    this.syncFormState();
  }

  protected syncFormState(): void {
    const input = this.#input;
    if (!input) return;
    this.internals.setFormValue(this.value === null ? '' : String(this.value));
    this.setValidityFrom(input);
  }

  protected resetValue(): void {
    this.value = this.defaultValue ?? null;
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    this.value = toNumber(state ?? '');
  }

  #step(count: number): void {
    const input = this.#input;
    if (!input || this.isDisabled || this.readonly) return;
    // The native input steps from `min`, clamps to the range and rounds to `step`.
    if (count > 0) input.stepUp(count);
    else input.stepDown(-count);
    this.#text = input.value;
    this.value = toNumber(input.value);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.emitChange();
  }

  #onInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this.#text = input.value;
    this.value = toNumber(input.value);
  };

  #onChange = (): void => {
    this.markInteracted();
    this.emitChange();
  };

  #onKeyDown = (event: KeyboardEvent): void => submitOnEnter(event, this.form);

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');
    const locked = this.isDisabled || this.readonly;
    const value = this.value;

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
          <slot name="prefix"></slot>
          <input
            id=${this.#id}
            class="native"
            part="input"
            type="number"
            name=${ifDefined(this.name || undefined)}
            .value=${live(this.#text)}
            placeholder=${ifDefined(this.placeholder)}
            min=${ifDefined(this.min ?? undefined)}
            max=${ifDefined(this.max ?? undefined)}
            step=${ifDefined(Number.isFinite(this.step) && this.step > 0 ? this.step : undefined)}
            ?required=${this.required}
            ?readonly=${this.readonly}
            ?disabled=${this.isDisabled}
            aria-invalid=${error ? 'true' : 'false'}
            aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
            @input=${this.#onInput}
            @change=${this.#onChange}
            @keydown=${this.#onKeyDown}
          />
          <slot name="suffix"></slot>
          <span class="steppers" part="steppers">
            <button
              class="step"
              part="decrement"
              type="button"
              tabindex="-1"
              aria-label=${this.translator.t('decrease')}
              aria-controls=${this.#id}
              ?disabled=${locked || (value !== null && this.min !== null && value <= this.min)}
              @click=${() => this.#step(-1)}
            >
              ${iconSvg(icons.minus, '')}
            </button>
            <button
              class="step"
              part="increment"
              type="button"
              tabindex="-1"
              aria-label=${this.translator.t('increase')}
              aria-controls=${this.#id}
              ?disabled=${locked || (value !== null && this.max !== null && value >= this.max)}
              @click=${() => this.#step(1)}
            >
              ${iconSvg(icons.plus, '')}
            </button>
          </span>
        </div>
      `,
    });
  }
}

/** The number in the field's text, or `null` when it's empty or not a number. */
function toNumber(text: string): number | null {
  if (text.trim() === '') return null;
  const number = Number(text);
  return Number.isNaN(number) ? null : number;
}

defineElement('uf-number-input', UfNumberInput);

declare global {
  interface HTMLElementTagNameMap {
    'uf-number-input': UfNumberInput;
  }
}
