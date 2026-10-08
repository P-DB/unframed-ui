import { css, html, nothing, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineElement } from '../../internal/define.js';
import { describedBy, fieldStyles } from '../../internal/field.js';
import { FormControl } from '../../internal/form-control.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';
import '../radio/radio.js';
import type { UfRadio } from '../radio/radio.js';

/**
 * A group of `<uf-radio>` options with one selected value. Arrow keys move
 * the selection, and only the selected option is in the tab order.
 *
 * @summary Lets users pick exactly one option from a list.
 * @tag uf-radio-group
 *
 * @slot - `<uf-radio>` elements.
 * @slot label - The group label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the options. Overrides `hint`.
 *
 * @event input - Fired when the selection changes.
 * @event change - Fired when the selection changes.
 *
 * @csspart base - The element with `role="radiogroup"`.
 * @csspart form-label - The group label.
 * @csspart options - The wrapper around the radios.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssstate user-invalid - Required with nothing selected, after the user interacted.
 */
export class UfRadioGroup extends FormControl {
  static override shadowRootOptions = { ...FormControl.shadowRootOptions, delegatesFocus: false };

  static override styles = [
    hostStyles,
    fieldStyles,
    css`
      .options {
        display: flex;
        flex-direction: column;
        gap: var(--uf-space-2);
        margin-top: var(--uf-space-1);
      }

      :host([orientation='horizontal']) .options {
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--uf-space-2) var(--uf-space-5);
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    value: { attribute: false },
    defaultValue: { attribute: 'value' },
    label: {},
    hint: {},
    orientation: { reflect: true },
  };

  /** The selected radio's value, or an empty string. */
  declare value: string;
  /** Initially selected value, restored on form reset. Set with the `value` attribute. */
  declare defaultValue: string;
  /** Visible group label. */
  declare label: string | undefined;
  /** Help text below the options. */
  declare hint: string | undefined;
  /** Lays the options out in a column or a row. */
  declare orientation: 'vertical' | 'horizontal';

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-radio-group');

  constructor() {
    super();
    this.value = '';
    this.defaultValue = '';
    this.orientation = 'vertical';
    this.addEventListener('click', this.#onClick);
    this.addEventListener('keydown', this.#onKeyDown);
  }

  get #radios(): UfRadio[] {
    return [...this.querySelectorAll('uf-radio')];
  }

  #isEnabled(radio: UfRadio): boolean {
    return !radio.disabled && !this.isDisabled;
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultValue') && this.value === (changed.get('defaultValue') ?? '')) {
      this.value = this.defaultValue ?? '';
    }
  }

  override updated(): void {
    this.#syncRadios();
    this.syncFormState();
  }

  /** Reflects the group's value, disabled state and roving tabindex onto the radios. */
  #syncRadios(): void {
    const radios = this.#radios;
    const enabled = radios.filter((r) => this.#isEnabled(r));
    const focusable = enabled.find((r) => r.value === this.value) ?? enabled[0];
    const invalid = this.showInvalid;
    for (const radio of radios) {
      radio.checked = radio.value === this.value;
      radio.tabIndex = radio === focusable ? 0 : -1;
      radio.toggleAttribute('data-group-disabled', this.isDisabled);
      radio.toggleAttribute('data-invalid', invalid);
      radio.requestUpdate();
    }
  }

  protected syncFormState(): void {
    this.internals.setFormValue(this.value || null);
    this.setValidity(
      { valueMissing: this.required && !this.value },
      'Please select one of these options.',
      this.#radios[0],
    );
  }

  protected resetValue(): void {
    this.value = this.defaultValue ?? '';
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    this.value = state ?? '';
  }

  #select(radio: UfRadio): void {
    radio.focus();
    if (radio.value === this.value) return;
    this.value = radio.value;
    this.markInteracted();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.emitChange();
  }

  #onClick = (event: MouseEvent): void => {
    const radio = (event.target as Element).closest('uf-radio');
    if (radio && this.contains(radio) && this.#isEnabled(radio)) this.#select(radio);
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    const radios = this.#radios.filter((r) => this.#isEnabled(r));
    const current = (event.target as Element).closest('uf-radio');
    if (!current || !radios.length) return;

    const index = radios.indexOf(current);
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (step) {
      event.preventDefault();
      this.#select(radios[(index + step + radios.length) % radios.length]);
    } else if (event.key === ' ') {
      event.preventDefault();
      this.#select(current);
    }
  };

  /** Moves focus to the selected radio, or the first enabled one. */
  override focus(options?: FocusOptions): void {
    this.#radios.find((r) => r.tabIndex === 0)?.focus(options);
  }

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const labelId = `${this.#id}-label`;
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');
    const hasLabel = Boolean(this.label) || this.#slots.has('label');

    return html`
      <div
        class=${classMap({ field: true, invalid: Boolean(error) })}
        part="base"
        role="radiogroup"
        aria-labelledby=${ifDefined(hasLabel ? labelId : undefined)}
        aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
        aria-required=${this.required ? 'true' : 'false'}
        aria-invalid=${error ? 'true' : 'false'}
        aria-disabled=${this.isDisabled ? 'true' : 'false'}
      >
        <div id=${labelId} class="field-label" part="form-label" ?hidden=${!hasLabel}>
          <slot name="label">${this.label}</slot>
          ${this.required ? html`<span class="required" aria-hidden="true">*</span>` : nothing}
        </div>
        <div class="options" part="options">
          <slot @slotchange=${() => this.#syncRadios()}></slot>
        </div>
        <div id=${ids.hintId} class="field-hint" part="hint" ?hidden=${!this.hint && !hasHintSlot}>
          <slot name="hint">${this.hint}</slot>
        </div>
        <div id=${ids.errorId} class="field-error" part="error" ?hidden=${!error}>${error}</div>
      </div>
    `;
  }
}

defineElement('uf-radio-group', UfRadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    'uf-radio-group': UfRadioGroup;
  }
}
