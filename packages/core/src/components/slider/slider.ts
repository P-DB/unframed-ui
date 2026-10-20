import { css, html, type PropertyDeclarations, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { defineElement } from '../../internal/define.js';
import { describedBy, fieldStyles, renderField } from '../../internal/field.js';
import { FormControl } from '../../internal/form-control.js';
import { focusRing, hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';

/**
 * Picks a number in a range by dragging a handle, or with the arrow keys. Built
 * on the native range input, so keyboard, touch and screen readers work as
 * they do everywhere; it submits its value with the form.
 *
 * @summary Lets users pick a number in a range.
 * @tag uf-slider
 *
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the slider. Overrides `hint`.
 *
 * @event input - Fired while the handle moves.
 * @event change - Fired when the user lets go, or after a key press.
 *
 * @csspart field - The wrapper around label, slider, hint and error.
 * @csspart form-label - The label.
 * @csspart value - The current value, when `show-value` is set.
 * @csspart input - The native range `<input>`.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-slider-track-height - Height of the track.
 * @cssprop --uf-slider-track-color - Color of the track's empty part.
 * @cssprop --uf-slider-fill-color - Color of the track up to the handle.
 * @cssprop --uf-slider-thumb-size - Diameter of the handle.
 */
export class UfSlider extends FormControl {
  static override styles = [
    hostStyles,
    fieldStyles,
    css`
      :host {
        --_track: var(--uf-slider-track-height, 0.375rem);
        --_thumb: var(--uf-slider-thumb-size, 1.125rem);
        --_fill-color: var(--uf-slider-fill-color, var(--uf-color-accent));
        --_track-color: var(--uf-slider-track-color, var(--uf-color-surface-hover));
      }

      .value {
        color: var(--uf-color-text-muted);
        font-size: var(--uf-font-size-md);
        font-variant-numeric: tabular-nums;
      }

      .native {
        width: 100%;
        height: var(--_thumb);
        margin: 0;
        background: transparent;
        cursor: pointer;
        appearance: none;
      }

      .native:focus-visible {
        outline: none;
      }

      .native::-webkit-slider-runnable-track {
        height: var(--_track);
        border-radius: var(--uf-radius-control);
        background: linear-gradient(to right, var(--_fill-color) var(--_fill), var(--_track-color) var(--_fill));
      }

      .native::-moz-range-track {
        height: var(--_track);
        border-radius: var(--uf-radius-control);
        background: linear-gradient(to right, var(--_fill-color) var(--_fill), var(--_track-color) var(--_fill));
      }

      .native::-webkit-slider-thumb {
        width: var(--_thumb);
        height: var(--_thumb);
        margin-top: calc((var(--_track) - var(--_thumb)) / 2);
        border: 2px solid var(--_fill-color);
        border-radius: 50%;
        background: var(--uf-color-surface);
        box-shadow: var(--uf-shadow-sm);
        appearance: none;
      }

      .native::-moz-range-thumb {
        width: var(--_thumb);
        height: var(--_thumb);
        border: 2px solid var(--_fill-color);
        border-radius: 50%;
        background: var(--uf-color-surface);
        box-shadow: var(--uf-shadow-sm);
      }

      .native:focus-visible::-webkit-slider-thumb {
        ${focusRing}
      }

      .native:focus-visible::-moz-range-thumb {
        ${focusRing}
      }

      /* Grey, like disabled fields. */
      .native:disabled {
        --_fill-color: var(--uf-color-text-muted);
        --_track-color: var(--uf-color-neutral-fill);
        cursor: not-allowed;
      }

      :host([disabled]) .field-label,
      :host([disabled]) .value {
        color: var(--uf-color-text-muted);
      }
    `,
  ];

  protected static override formStateProperties: ReadonlySet<PropertyKey> = new Set([
    ...FormControl.formStateProperties,
    'min',
    'max',
    'step',
  ]);

  static override properties: PropertyDeclarations = {
    value: { type: Number, attribute: false },
    defaultValue: { type: Number, attribute: 'value' },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    label: {},
    hint: {},
    showValue: { type: Boolean, attribute: 'show-value' },
  };

  /** Current value. */
  declare value: number;
  /** Initial value, restored on form reset. Set with the `value` attribute. Defaults to the middle of the range, like a native slider. */
  declare defaultValue: number | undefined;
  /** Lowest value. */
  declare min: number;
  /** Highest value. */
  declare max: number;
  /** Granularity: the value moves in steps of this size. */
  declare step: number;
  /** Visible label, also the slider's accessible name. */
  declare label: string | undefined;
  /** Help text below the slider. */
  declare hint: string | undefined;
  /** Shows the current value next to the label. */
  declare showValue: boolean;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-slider');

  constructor() {
    super();
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.showValue = false;
    // Not a number yet: the first update puts it in the middle of min and max.
    this.value = Number.NaN;
  }

  get #input(): HTMLInputElement | null {
    return this.renderRoot.querySelector('input');
  }

  /** The value a native slider would hold: within min and max, on a step. */
  #normalize(value: number | undefined): number {
    const min = this.min;
    const max = Math.max(this.max, min);
    const fallback = min + (max - min) / 2;
    const v = value == null || Number.isNaN(value) ? fallback : value;
    const clamped = Math.min(Math.max(v, min), max);
    const step = this.step > 0 ? this.step : 1;
    const stepped = min + Math.round((clamped - min) / step) * step;
    // Avoid 0.30000000000000004 with decimal steps.
    return Number(Math.min(stepped, max).toFixed(10));
  }

  override willUpdate(changed: PropertyValues<this>): void {
    // Like a native input: the value follows the `value` attribute until it is changed.
    if (changed.has('defaultValue') && (!this.hasUpdated || this.value === this.#normalize(changed.get('defaultValue')))) {
      this.value = this.#normalize(this.defaultValue);
    }
    if (changed.has('value') || changed.has('min') || changed.has('max') || changed.has('step')) {
      const normalized = this.#normalize(this.value);
      if (normalized !== this.value) this.value = normalized;
    }
  }

  override updated(): void {
    this.syncFormState();
  }

  protected syncFormState(): void {
    const input = this.#input;
    if (!input) return;
    this.internals.setFormValue(String(this.value));
    this.setValidityFrom(input);
  }

  protected resetValue(): void {
    this.value = this.#normalize(this.defaultValue);
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    this.value = this.#normalize(state == null ? undefined : Number(state));
  }

  #onInput = (event: Event): void => {
    this.value = Number((event.target as HTMLInputElement).value);
  };

  #onChange = (): void => {
    this.markInteracted();
    this.emitChange();
  };

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');
    const range = this.max - this.min;
    const fill = range > 0 ? ((this.value - this.min) / range) * 100 : 0;

    return renderField({
      ...ids,
      controlId: this.#id,
      label: this.label,
      hasLabelSlot: this.#slots.has('label'),
      hint: this.hint,
      hasHintSlot,
      error,
      required: false,
      // The native slider announces its value already.
      labelEnd: this.showValue ? html`<span class="value" part="value" aria-hidden="true">${this.value}</span>` : undefined,
      control: html`
        <input
          id=${this.#id}
          class="native"
          part="input"
          type="range"
          style="--_fill: ${fill}%"
          name=${ifDefined(this.name || undefined)}
          min=${this.min}
          max=${this.max}
          step=${this.step}
          .value=${live(String(this.value))}
          ?disabled=${this.isDisabled}
          aria-invalid=${error ? 'true' : 'false'}
          aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
          @input=${this.#onInput}
          @change=${this.#onChange}
        />
      `,
    });
  }
}

defineElement('uf-slider', UfSlider);

declare global {
  interface HTMLElementTagNameMap {
    'uf-slider': UfSlider;
  }
}
