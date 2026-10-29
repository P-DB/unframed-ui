import { html, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { defineElement } from '../../internal/define.js';
import { controlBoxStyles, describedBy, fieldStyles, renderField, type FieldSize } from '../../internal/field.js';
import { FormControl } from '../../internal/form-control.js';
import { submitOnEnter } from '../../internal/implicit-submission.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';

export type { FieldSize };

export type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' | 'date' | 'time';

/**
 * A single-line text field with a built-in label, hint and validation message.
 *
 * @summary Lets users enter a single line of text.
 * @tag uf-input
 *
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the field. Overrides `hint`.
 * @slot prefix - An icon or text before the input.
 * @slot suffix - An icon or text after the input.
 *
 * @event input - Fired on every keystroke.
 * @event change - Fired when the value is committed (blur or Enter).
 *
 * @csspart field - The wrapper around label, control, hint and error.
 * @csspart form-label - The label.
 * @csspart box - The bordered box around the input.
 * @csspart input - The native `<input>`.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-field-bg - Background of the box.
 * @cssprop --uf-field-border-color - Border color of the box.
 * @cssprop --uf-field-radius - Corner radius of the box.
 *
 * @cssstate user-invalid - The value is invalid and the user has interacted with the field.
 */
export class UfInput extends FormControl {
  static override styles = [hostStyles, fieldStyles, controlBoxStyles];

  protected static override formStateProperties: ReadonlySet<PropertyKey> = new Set([
    ...FormControl.formStateProperties,
    'type',
    'readonly',
    'pattern',
    'min',
    'max',
    'step',
    'minlength',
    'maxlength',
  ]);

  static override properties: PropertyDeclarations = {
    type: { reflect: true },
    value: { attribute: false },
    defaultValue: { attribute: 'value' },
    label: {},
    hint: {},
    placeholder: {},
    size: { reflect: true },
    readonly: { type: Boolean, reflect: true },
    autocomplete: {},
    inputmode: {},
    pattern: {},
    min: {},
    max: {},
    step: {},
    minlength: { type: Number },
    maxlength: { type: Number },
  };

  /** Input type. */
  declare type: InputType;
  /** Current value. */
  declare value: string;
  /** Initial value, restored on form reset. Set with the `value` attribute. */
  declare defaultValue: string;
  /** Visible label. */
  declare label: string | undefined;
  /** Help text below the field. */
  declare hint: string | undefined;
  /** Placeholder text. */
  declare placeholder: string | undefined;
  /** Size of the field. */
  declare size: FieldSize;
  /** Makes the field read-only. */
  declare readonly: boolean;
  /** Native `autocomplete` hint. */
  declare autocomplete: AutoFill | undefined;
  /** Native `inputmode` hint for virtual keyboards. */
  declare inputmode: string | undefined;
  /** Regex the value must match. */
  declare pattern: string | undefined;
  /** Minimum value, for number and date types. */
  declare min: string | undefined;
  /** Maximum value, for number and date types. */
  declare max: string | undefined;
  /** Step, for number and date types. */
  declare step: string | undefined;
  /** Minimum length. */
  declare minlength: number | undefined;
  /** Maximum length. */
  declare maxlength: number | undefined;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-input');

  constructor() {
    super();
    this.type = 'text';
    this.value = '';
    this.defaultValue = '';
    this.size = 'md';
    this.readonly = false;
  }

  get #input(): HTMLInputElement | null {
    return this.renderRoot.querySelector('input');
  }

  /** Selects all text in the field. */
  select(): void {
    this.#input?.select();
  }

  override willUpdate(changed: PropertyValues<this>): void {
    // Like a native input: the value follows the `value` attribute until it is edited.
    if (changed.has('defaultValue') && this.value === (changed.get('defaultValue') ?? '')) {
      this.value = this.defaultValue ?? '';
    }
  }

  override updated(): void {
    this.syncFormState();
  }

  protected syncFormState(): void {
    const input = this.#input;
    if (!input) return;
    this.internals.setFormValue(this.value);
    this.setValidityFrom(input);
  }

  protected resetValue(): void {
    this.value = this.defaultValue ?? '';
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    this.value = state ?? '';
  }

  #onInput = (event: Event): void => {
    this.value = (event.target as HTMLInputElement).value;
  };

  #onChange = (): void => {
    this.markInteracted();
    this.emitChange();
  };

  #onKeyDown = (event: KeyboardEvent): void => submitOnEnter(event, this.form);

  override render() {
    const ids = {
      hintId: `${this.#id}-hint`,
      errorId: `${this.#id}-error`,
    };
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
          <slot name="prefix"></slot>
          <input
            id=${this.#id}
            class="native"
            part="input"
            type=${this.type}
            name=${ifDefined(this.name || undefined)}
            .value=${live(this.value)}
            placeholder=${ifDefined(this.placeholder)}
            autocomplete=${ifDefined(this.autocomplete)}
            inputmode=${ifDefined(this.inputmode)}
            pattern=${ifDefined(this.pattern)}
            min=${ifDefined(this.min)}
            max=${ifDefined(this.max)}
            step=${ifDefined(this.step)}
            minlength=${ifDefined(this.minlength)}
            maxlength=${ifDefined(this.maxlength)}
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
        </div>
      `,
    });
  }
}

defineElement('uf-input', UfInput);

declare global {
  interface HTMLElementTagNameMap {
    'uf-input': UfInput;
  }
}
