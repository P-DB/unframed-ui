import { css, html, nothing, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { defineElement } from '../../internal/define.js';
import { controlBoxStyles, describedBy, fieldStyles, renderField } from '../../internal/field.js';
import { FormControl } from '../../internal/form-control.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';
import type { FieldSize } from '../input/input.js';

interface OptionItem {
  kind: 'option';
  value: string;
  label: string;
  disabled: boolean;
  selected: boolean;
}

interface GroupItem {
  kind: 'group';
  label: string;
  disabled: boolean;
  options: OptionItem[];
}

type Item = OptionItem | GroupItem;

function readOption(option: HTMLOptionElement): OptionItem {
  return {
    kind: 'option',
    value: option.value,
    label: option.label || option.textContent?.trim() || '',
    disabled: option.disabled,
    selected: option.hasAttribute('selected'),
  };
}

/**
 * A dropdown built on the native `<select>`, so it gets the platform's
 * keyboard support, screen reader support and mobile pickers for free.
 * Write options as plain `<option>` and `<optgroup>` children.
 *
 * @summary Lets users pick one option from a dropdown list.
 * @tag uf-select
 *
 * @slot - `<option>` and `<optgroup>` elements. They are mirrored into the native select.
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the field. Overrides `hint`.
 * @slot prefix - An icon before the selected value.
 *
 * @event input - Fired when the selection changes.
 * @event change - Fired when the selection changes.
 *
 * @csspart field - The wrapper around label, control, hint and error.
 * @csspart form-label - The label.
 * @csspart box - The bordered box.
 * @csspart select - The native `<select>`.
 * @csspart chevron - The dropdown arrow.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-field-bg - Background of the box.
 * @cssprop --uf-field-border-color - Border color of the box.
 * @cssprop --uf-field-radius - Corner radius of the box.
 *
 * @cssstate user-invalid - The value is invalid and the user has interacted with the field.
 */
export class UfSelect extends FormControl {
  static override styles = [
    hostStyles,
    fieldStyles,
    controlBoxStyles,
    css`
      .box {
        position: relative;
        padding-inline-end: 0;
      }

      .native {
        appearance: none;
        min-height: calc(var(--_height) - 2px);
        padding-inline-end: calc(var(--_padding) + 1.25em);
        cursor: pointer;
      }

      .native:invalid,
      .native.placeholder {
        color: var(--uf-color-text-muted);
      }

      .native option {
        color: var(--uf-color-text);
        background: var(--uf-color-surface-overlay);
      }

      .icon {
        position: absolute;
        inset-inline-end: var(--_padding);
        width: 1em;
        height: 1em;
        color: var(--uf-color-text-muted);
        pointer-events: none;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    value: { attribute: false },
    defaultValue: { attribute: 'value' },
    label: {},
    hint: {},
    placeholder: {},
    size: { reflect: true },
    autocomplete: {},
  };

  /** The selected option's value. */
  declare value: string;
  /** Initially selected value, restored on form reset. Set with the `value` attribute. */
  declare defaultValue: string | undefined;
  /** Visible label. */
  declare label: string | undefined;
  /** Help text below the field. */
  declare hint: string | undefined;
  /** Text shown while nothing is selected. */
  declare placeholder: string | undefined;
  /** Size of the field. */
  declare size: FieldSize;
  /** Native `autocomplete` hint. */
  declare autocomplete: AutoFill | undefined;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-select');
  readonly #observer = new MutationObserver(() => this.#readItems());
  #items: Item[] = [];
  #itemsChanged = false;
  #hasInitialized = false;

  constructor() {
    super();
    this.value = '';
    this.size = 'md';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#readItems();
    this.#observer.observe(this, { childList: true, subtree: true, attributes: true, characterData: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#observer.disconnect();
  }

  get #select(): HTMLSelectElement | null {
    return this.renderRoot.querySelector('select');
  }

  get #options(): OptionItem[] {
    return this.#items.flatMap((item) => (item.kind === 'group' ? item.options : [item]));
  }

  /** Mirrors the light-DOM options into the native select. */
  #readItems(): void {
    this.#items = [...this.children].flatMap((child): Item[] => {
      if (child instanceof HTMLOptionElement) return [readOption(child)];
      if (child instanceof HTMLOptGroupElement) {
        return [
          {
            kind: 'group',
            label: child.label,
            disabled: child.disabled,
            options: [...child.querySelectorAll('option')].map(readOption),
          },
        ];
      }
      return [];
    });
    this.#itemsChanged = true;
    this.requestUpdate();
  }

  /** The value a reset returns to: the `value` attribute, a `selected` option, or the native default. */
  #initialValue(): string {
    if (this.defaultValue !== undefined && this.defaultValue !== null) return this.defaultValue;
    const options = this.#options;
    const selected = options.find((o) => o.selected);
    if (selected) return selected.value;
    if (this.placeholder) return '';
    return options.find((o) => !o.disabled)?.value ?? '';
  }

  override willUpdate(changed: PropertyValues<this>): void {
    const defaultChanged = changed.has('defaultValue') || changed.has('placeholder') || this.#itemsChanged;
    if (!defaultChanged) return;
    this.#itemsChanged = false;
    // Follow the default until the user (or code) picks something else.
    if (!this.#hasInitialized || !this.#options.some((o) => o.value === this.value)) {
      this.value = this.#initialValue();
      this.#hasInitialized = this.#items.length > 0;
    }
  }

  override updated(): void {
    this.syncFormState();
  }

  protected syncFormState(): void {
    const select = this.#select;
    if (!select) return;
    this.internals.setFormValue(this.value);
    this.setValidityFrom(select);
  }

  protected resetValue(): void {
    this.value = this.#initialValue();
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    this.value = state ?? '';
  }

  #onChange = (event: Event): void => {
    this.value = (event.target as HTMLSelectElement).value;
    this.markInteracted();
    this.emitChange();
  };

  #renderOption(option: OptionItem) {
    return html`<option value=${option.value} ?disabled=${option.disabled} ?selected=${option.value === this.value}>
      ${option.label}
    </option>`;
  }

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');
    const showingPlaceholder = Boolean(this.placeholder) && !this.value;

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
          <select
            id=${this.#id}
            class=${classMap({ native: true, placeholder: showingPlaceholder })}
            part="select"
            name=${ifDefined(this.name || undefined)}
            autocomplete=${ifDefined(this.autocomplete)}
            .value=${live(this.value)}
            ?required=${this.required}
            ?disabled=${this.isDisabled}
            aria-invalid=${error ? 'true' : 'false'}
            aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
            @change=${this.#onChange}
          >
            ${this.placeholder
              ? html`<option value="" disabled hidden ?selected=${!this.value}>${this.placeholder}</option>`
              : nothing}
            ${this.#items.map((item) =>
              item.kind === 'group'
                ? html`<optgroup label=${item.label} ?disabled=${item.disabled}>
                    ${item.options.map((o) => this.#renderOption(o))}
                  </optgroup>`
                : this.#renderOption(item),
            )}
          </select>
          ${iconSvg(icons['chevron-down'], 'chevron')}
        </div>
      `,
    });
  }
}

defineElement('uf-select', UfSelect);

declare global {
  interface HTMLElementTagNameMap {
    'uf-select': UfSelect;
  }
}
