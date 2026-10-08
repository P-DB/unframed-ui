import { css, html, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { defineElement } from '../../internal/define.js';
import { controlBoxStyles, describedBy, fieldStyles, renderField } from '../../internal/field.js';
import { FormControl } from '../../internal/form-control.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';
import type { FieldSize } from '../input/input.js';

export type TextareaResize = 'none' | 'vertical' | 'auto';

/**
 * A multi-line text field with a built-in label, hint and validation message.
 *
 * @summary Lets users enter multiple lines of text.
 * @tag uf-textarea
 *
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the field. Overrides `hint`.
 *
 * @event input - Fired on every keystroke.
 * @event change - Fired when the value is committed (blur).
 *
 * @csspart field - The wrapper around label, control, hint and error.
 * @csspart form-label - The label.
 * @csspart box - The bordered box around the textarea.
 * @csspart textarea - The native `<textarea>`.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-field-bg - Background of the box.
 * @cssprop --uf-field-border-color - Border color of the box.
 * @cssprop --uf-field-radius - Corner radius of the box.
 *
 * @cssstate user-invalid - The value is invalid and the user has interacted with the field.
 */
export class UfTextarea extends FormControl {
  static override styles = [
    hostStyles,
    fieldStyles,
    controlBoxStyles,
    css`
      .box {
        align-items: stretch;
        padding-block: var(--uf-space-2);
      }

      .native {
        min-height: 3lh;
        line-height: 1.5;
        resize: vertical;
      }

      :host([resize='none']) .native {
        resize: none;
      }

      /* Grows with its content where supported (field-sizing), otherwise resizable. */
      :host([resize='auto']) .native {
        field-sizing: content;
        resize: none;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    value: { attribute: false },
    defaultValue: { attribute: 'value' },
    label: {},
    hint: {},
    placeholder: {},
    rows: { type: Number },
    resize: { reflect: true },
    size: { reflect: true },
    readonly: { type: Boolean, reflect: true },
    autocomplete: {},
    minlength: { type: Number },
    maxlength: { type: Number },
  };

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
  /** Visible number of lines. */
  declare rows: number;
  /** How the user can resize the field. `auto` grows with the content. */
  declare resize: TextareaResize;
  /** Size of the field. */
  declare size: FieldSize;
  /** Makes the field read-only. */
  declare readonly: boolean;
  /** Native `autocomplete` hint. */
  declare autocomplete: AutoFill | undefined;
  /** Minimum length. */
  declare minlength: number | undefined;
  /** Maximum length. */
  declare maxlength: number | undefined;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-textarea');

  constructor() {
    super();
    this.value = '';
    this.defaultValue = '';
    this.rows = 4;
    this.resize = 'vertical';
    this.size = 'md';
    this.readonly = false;
  }

  get #textarea(): HTMLTextAreaElement | null {
    return this.renderRoot.querySelector('textarea');
  }

  /** Selects all text in the field. */
  select(): void {
    this.#textarea?.select();
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultValue') && this.value === (changed.get('defaultValue') ?? '')) {
      this.value = this.defaultValue ?? '';
    }
  }

  override updated(): void {
    this.syncFormState();
  }

  protected syncFormState(): void {
    const textarea = this.#textarea;
    if (!textarea) return;
    this.internals.setFormValue(this.value);
    this.setValidityFrom(textarea);
  }

  protected resetValue(): void {
    this.value = this.defaultValue ?? '';
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    this.value = state ?? '';
  }

  #onInput = (event: Event): void => {
    this.value = (event.target as HTMLTextAreaElement).value;
  };

  #onChange = (): void => {
    this.markInteracted();
    this.emitChange();
  };

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
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
          <textarea
            id=${this.#id}
            class="native"
            part="textarea"
            name=${ifDefined(this.name || undefined)}
            .value=${live(this.value)}
            rows=${this.rows}
            placeholder=${ifDefined(this.placeholder)}
            autocomplete=${ifDefined(this.autocomplete)}
            minlength=${ifDefined(this.minlength)}
            maxlength=${ifDefined(this.maxlength)}
            ?required=${this.required}
            ?readonly=${this.readonly}
            ?disabled=${this.isDisabled}
            aria-invalid=${error ? 'true' : 'false'}
            aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
            @input=${this.#onInput}
            @change=${this.#onChange}
          ></textarea>
        </div>
      `,
    });
  }
}

defineElement('uf-textarea', UfTextarea);

declare global {
  interface HTMLElementTagNameMap {
    'uf-textarea': UfTextarea;
  }
}
