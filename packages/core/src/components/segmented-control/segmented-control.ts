import { css, html, nothing, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineElement } from '../../internal/define.js';
import { describedBy, fieldStyles, type FieldSize } from '../../internal/field.js';
import { FormControl } from '../../internal/form-control.js';
import { flattenOptions, readItems, type OptionItem } from '../../internal/options.js';
import { focusRing, hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';

/**
 * A row of buttons for one choice among a few, like "List / Grid" or "Day /
 * Week / Month". The choices are plain `<option>` children. One is always
 * selected: the `value` attribute, an option marked `selected`, or the first.
 *
 * It's a radio group for assistive tech: arrow keys move and select, Home and
 * End jump to the ends, and it submits its value with a form.
 *
 * @summary Picks one of a few options, side by side.
 * @tag uf-segmented-control
 *
 * @slot - `<option>` elements. `disabled` options can't be picked.
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the options. Overrides `hint`.
 *
 * @event input - The user picked another option.
 * @event change - The user picked another option.
 *
 * @csspart base - The element with `role="radiogroup"`.
 * @csspart form-label - The label.
 * @csspart options - The row of buttons.
 * @csspart option - One button. The selected one also has the part `selected`.
 * @csspart selected - The selected button.
 * @csspart hint - The hint text.
 *
 * @cssprop --uf-segmented-control-bg - Background behind the buttons.
 * @cssprop --uf-segmented-control-selected-bg - Background of the selected button.
 * @cssprop --uf-segmented-control-selected-color - Text color of the selected button.
 * @cssprop --uf-segmented-control-radius - Corner radius of the row.
 */
export class UfSegmentedControl extends FormControl {
  static override styles = [
    hostStyles,
    fieldStyles,
    css`
      :host {
        display: inline-block;
      }

      .options {
        --_height: var(--uf-size-control-md);
        display: inline-flex;
        gap: 2px;
        padding: 2px;
        border: 1px solid var(--uf-color-border-strong);
        border-radius: var(--uf-segmented-control-radius, var(--uf-radius-control));
        background: var(--uf-segmented-control-bg, var(--uf-color-surface));
      }

      :host([size='sm']) .options {
        --_height: var(--uf-size-control-sm);
      }

      :host([size='lg']) .options {
        --_height: var(--uf-size-control-lg);
      }

      /* Share any extra width when the row is stretched, as in a grid; no effect at its natural width. */
      .option {
        flex: 1 1 auto;
        min-height: calc(var(--_height) - 6px);
        padding: 0 var(--uf-space-3);
        border: 0;
        border-radius: inherit;
        background: transparent;
        color: var(--uf-color-text-muted);
        font: inherit;
        font-size: var(--uf-font-size-md);
        font-weight: var(--uf-font-weight-medium);
        white-space: nowrap;
        cursor: pointer;
        transition:
          background-color var(--uf-duration-fast) ease,
          color var(--uf-duration-fast) ease;
      }

      :host([size='sm']) .option {
        padding: 0 var(--uf-space-2);
        font-size: var(--uf-font-size-sm);
      }

      :host([size='lg']) .option {
        padding: 0 var(--uf-space-4);
        font-size: var(--uf-font-size-lg);
      }

      .option:hover:not(:disabled):not(.selected) {
        background: var(--uf-color-surface-hover);
        color: var(--uf-color-text);
      }

      .option.selected {
        background: var(--uf-segmented-control-selected-bg, var(--uf-color-accent));
        color: var(--uf-segmented-control-selected-color, var(--uf-color-on-accent));
      }

      .option:focus-visible {
        ${focusRing}
      }

      .option:disabled {
        color: var(--uf-color-border-strong);
        cursor: not-allowed;
      }

      /* Grey, like disabled fields. */
      .disabled .options {
        border-color: var(--uf-color-border);
        background: var(--uf-color-neutral-fill);
      }

      .disabled .option.selected {
        background: var(--uf-color-border-strong);
        color: var(--uf-color-surface);
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    value: { attribute: false },
    defaultValue: { attribute: 'value' },
    label: {},
    hint: {},
    size: { reflect: true },
  };

  /** The selected option's value. */
  declare value: string;
  /** Initially selected value, restored on form reset. Set with the `value` attribute. */
  declare defaultValue: string | undefined;
  /** Visible label, also the group's accessible name. */
  declare label: string | undefined;
  /** Help text below the options. */
  declare hint: string | undefined;
  /** Size of the buttons. */
  declare size: FieldSize;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-segmented-control');
  readonly #observer = new MutationObserver(() => this.#readOptions());
  #options: OptionItem[] = [];
  #optionsChanged = false;
  #hasInitialized = false;

  constructor() {
    super();
    this.value = '';
    this.size = 'md';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#readOptions();
    this.#observer.observe(this, { childList: true, subtree: true, attributes: true, characterData: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#observer.disconnect();
  }

  #readOptions(): void {
    this.#options = flattenOptions(readItems(this));
    this.#optionsChanged = true;
    this.requestUpdate();
  }

  /** The value a reset returns to: the `value` attribute, a `selected` option, or the first enabled one. */
  #initialValue(): string {
    if (this.defaultValue !== undefined && this.defaultValue !== null) return this.defaultValue;
    return (this.#options.find((o) => o.selected) ?? this.#options.find((o) => !o.disabled))?.value ?? '';
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (!changed.has('defaultValue') && !this.#optionsChanged) return;
    this.#optionsChanged = false;
    // Frameworks often connect the element before appending its options: wait for them.
    if (!this.#options.length) return;
    const valid = this.#options.some((o) => o.value === this.value);
    if (!this.#hasInitialized) {
      // A value set before the options were read (e.g. by a framework) wins if it exists.
      if (!(this.value && valid)) this.value = this.#initialValue();
      this.#hasInitialized = true;
    } else if (!valid || changed.has('defaultValue')) {
      this.value = this.#initialValue();
    }
  }

  override updated(): void {
    this.syncFormState();
  }

  protected syncFormState(): void {
    this.internals.setFormValue(this.value);
    // One option is always selected: nothing to validate.
    this.setValidity({}, '');
  }

  protected resetValue(): void {
    this.value = this.#initialValue();
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    this.value = state ?? '';
  }

  get #buttons(): HTMLButtonElement[] {
    return [...this.renderRoot.querySelectorAll<HTMLButtonElement>('.option')];
  }

  /** Moves focus to the selected option. */
  override focus(options?: FocusOptions): void {
    this.#buttons.find((b) => b.tabIndex === 0)?.focus(options);
  }

  #select(option: OptionItem, focus = false): void {
    if (option.disabled || this.isDisabled) return;
    if (focus) this.updateComplete.then(() => this.focus());
    if (option.value === this.value) return;
    this.value = option.value;
    this.markInteracted();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.emitChange();
  }

  #onKeyDown = (event: KeyboardEvent): void => {
    const enabled = this.#options.filter((o) => !o.disabled);
    const index = enabled.findIndex((o) => o.value === this.value);
    const rtl = getComputedStyle(this).direction === 'rtl';
    const next = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, ArrowDown: 1, ArrowUp: -1 }[event.key];
    let target: OptionItem | undefined;
    if (next) target = enabled[(index + next + enabled.length) % enabled.length];
    else if (event.key === 'Home') target = enabled[0];
    else if (event.key === 'End') target = enabled[enabled.length - 1];
    if (!target) return;
    event.preventDefault();
    this.#select(target, true);
  };

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const labelId = `${this.#id}-label`;
    const hasHintSlot = this.#slots.has('hint');
    const hasLabel = Boolean(this.label) || this.#slots.has('label');
    const disabled = this.isDisabled;
    // The selected option takes Tab; with none (no options yet), the first enabled one.
    const focusable = this.#options.find((o) => o.value === this.value && !o.disabled) ?? this.#options.find((o) => !o.disabled);

    return html`
      <div
        class=${classMap({ field: true, disabled })}
        part="base"
        role="radiogroup"
        aria-labelledby=${ifDefined(hasLabel ? labelId : undefined)}
        aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error: '' }))}
        aria-disabled=${disabled ? 'true' : 'false'}
      >
        <div id=${labelId} class="field-label" part="form-label" ?hidden=${!hasLabel}>
          <slot name="label">${this.label ?? nothing}</slot>
        </div>
        <div class="options" part="options" @keydown=${this.#onKeyDown}>
          ${this.#options.map((option) => {
            const selected = option.value === this.value;
            return html`<button
              class=${classMap({ option: true, selected })}
              part=${selected ? 'option selected' : 'option'}
              type="button"
              role="radio"
              aria-checked=${selected ? 'true' : 'false'}
              tabindex=${option === focusable ? 0 : -1}
              ?disabled=${disabled || option.disabled}
              @click=${() => this.#select(option)}
            >
              ${option.label}
            </button>`;
          })}
        </div>
        <div id=${ids.hintId} class="field-hint" part="hint" ?hidden=${!(this.hint || hasHintSlot)}>
          <slot name="hint">${this.hint ?? nothing}</slot>
        </div>
      </div>
    `;
  }
}

defineElement('uf-segmented-control', UfSegmentedControl);

declare global {
  interface HTMLElementTagNameMap {
    'uf-segmented-control': UfSegmentedControl;
  }
}
