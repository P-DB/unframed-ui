import { css, html, nothing, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { defineElement } from '../../internal/define.js';
import { controlBoxStyles, describedBy, fieldStyles, renderField, type FieldSize } from '../../internal/field.js';
import { FormControl } from '../../internal/form-control.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { flattenOptions, observeOptions, readItems, type Item, type OptionItem } from '../../internal/options.js';
import { autoUpdate, positionFloating } from '../../internal/position.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';

/** A visible option, with its group and its index among visible options. */
interface Row {
  option: OptionItem;
  group?: string;
  index: number;
}

/**
 * A text field with a filterable list of options, following the WAI-ARIA
 * combobox pattern. Typing filters the list; arrow keys move through it and
 * Enter picks an option. Only listed values can be chosen. Write options as
 * plain `<option>` and `<optgroup>` children, like `<uf-select>`.
 *
 * @summary Lets users search a list and pick one option.
 * @tag uf-combobox
 *
 * @slot - `<option>` and `<optgroup>` elements. They are read, not rendered.
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the field. Overrides `hint`.
 * @slot prefix - An icon before the input.
 *
 * @event input - Fired as the user types in the field (the search text, not the value).
 * @event change - Fired when the selected value changes.
 * @event uf-show - The list opened.
 * @event uf-hide - The list closed.
 *
 * @csspart field - The wrapper around label, control, hint and error.
 * @csspart form-label - The label.
 * @csspart box - The bordered box.
 * @csspart input - The native `<input>`.
 * @csspart toggle - The button that opens the list.
 * @csspart listbox - The floating list.
 * @csspart option - Each option.
 * @csspart group-label - Each group heading.
 * @csspart empty - The "no results" message.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-combobox-max-height - Maximum height of the list before it scrolls.
 *
 * @cssstate user-invalid - The value is invalid and the user has interacted with the field.
 */
export class UfCombobox extends FormControl {
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

      .toggle:disabled {
        cursor: not-allowed;
      }

      .toggle .icon {
        width: 1em;
        height: 1em;
        transition: rotate var(--uf-duration-fast) ease;
      }

      .toggle.open .icon {
        rotate: 180deg;
      }

      .listbox {
        position: fixed;
        inset: auto;
        margin: 0;
        max-height: var(--uf-combobox-max-height, 16rem);
        padding: var(--uf-space-1) 0;
        overflow: auto;
        border: 1px solid var(--uf-color-border);
        border-radius: var(--uf-radius-control);
        background: var(--uf-color-surface-overlay);
        color: var(--uf-color-text);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-md);
        box-shadow: var(--uf-shadow-md);
      }

      .option {
        display: flex;
        align-items: center;
        gap: var(--uf-space-2);
        min-height: var(--uf-size-control-sm);
        padding: 0 var(--uf-space-3) 0 var(--uf-space-2);
        cursor: pointer;
        user-select: none;
      }

      .option .check {
        display: inline-flex;
        width: 1rem;
        flex: none;
      }

      .option .icon {
        width: 1rem;
        height: 1rem;
      }

      .option.active {
        background: var(--uf-color-accent-tint);
        color: var(--uf-color-on-accent-tint);
      }

      .option[aria-selected='true'] {
        font-weight: var(--uf-font-weight-medium);
      }

      .option[aria-disabled='true'] {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .group-label {
        padding: var(--uf-space-2) var(--uf-space-3) var(--uf-space-1);
        color: var(--uf-color-text-muted);
        font-size: var(--uf-font-size-sm);
        font-weight: var(--uf-font-weight-semibold);
      }

      .empty {
        padding: var(--uf-space-2) var(--uf-space-3);
        color: var(--uf-color-text-muted);
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
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
    open: { type: Boolean, reflect: true },
  };

  /** The selected option's value, or an empty string. */
  declare value: string;
  /** Initially selected value, restored on form reset. Set with the `value` attribute. */
  declare defaultValue: string | undefined;
  /** Visible label. */
  declare label: string | undefined;
  /** Help text below the field. */
  declare hint: string | undefined;
  /** Placeholder text in the field. */
  declare placeholder: string | undefined;
  /** Size of the field. */
  declare size: FieldSize;
  /** Whether the list is showing. */
  declare open: boolean;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-combobox');
  #observer?: MutationObserver;
  #items: Item[] = [];
  #itemsChanged = false;
  #hasInitialized = false;
  /** Text the user typed; null while the field shows the selected option's label. */
  #query: string | null = null;
  /** Index of the highlighted row among visible options, or -1. */
  #active = -1;
  #cleanup?: () => void;

  constructor() {
    super();
    this.value = '';
    this.size = 'md';
    this.open = false;
    this.addEventListener('focusout', this.#onFocusOut);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#readItems();
    this.#observer = observeOptions(this, () => this.#readItems());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#observer?.disconnect();
    this.#cleanup?.();
  }

  get #input(): HTMLInputElement | null {
    return this.renderRoot.querySelector('input');
  }

  get #listbox(): HTMLElement | null {
    return this.renderRoot.querySelector('.listbox');
  }

  get #options(): OptionItem[] {
    return flattenOptions(this.#items);
  }

  get #selected(): OptionItem | undefined {
    return this.#options.find((o) => o.value === this.value);
  }

  /** Options matching the current search, in order, with their group. */
  get #rows(): Row[] {
    const query = this.#query?.trim().toLowerCase() ?? '';
    const rows: Row[] = [];
    const add = (option: OptionItem, group?: string) => {
      if (!query || option.label.toLowerCase().includes(query)) rows.push({ option, group, index: rows.length });
    };
    for (const item of this.#items) {
      if (item.kind === 'group') item.options.forEach((o) => add(o, item.label));
      else add(item);
    }
    return rows;
  }

  #readItems(): void {
    this.#items = readItems(this);
    this.#itemsChanged = true;
    this.requestUpdate();
  }

  #initialValue(): string {
    if (this.defaultValue !== undefined && this.defaultValue !== null) return this.defaultValue;
    return this.#options.find((o) => o.selected)?.value ?? '';
  }

  /** Opens the list. */
  show(): void {
    if (!this.isDisabled) this.open = true;
  }

  /** Closes the list. */
  hide(): void {
    this.open = false;
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultValue') || this.#itemsChanged) {
      this.#itemsChanged = false;
      // Frameworks often connect the element before appending its options: wait for them.
      if (this.#items.length && !this.#hasInitialized) {
        // A value set before the options were read (e.g. by a framework) wins if it exists.
        if (!(this.value && this.#selected)) this.value = this.#initialValue();
        this.#hasInitialized = true;
      } else if (this.#items.length && this.value && !this.#selected) {
        this.value = this.#initialValue();
      }
    }
    if (changed.has('open') && !this.open) {
      this.#query = null;
      this.#active = -1;
    }
  }

  override updated(changed: PropertyValues<this>): void {
    this.syncFormState();
    if (changed.has('open')) this.#syncPopup();
    this.renderRoot.querySelector('.option.active')?.scrollIntoView({ block: 'nearest' });
  }

  #syncPopup(): void {
    const listbox = this.#listbox;
    const box = this.renderRoot.querySelector<HTMLElement>('.box');
    if (!listbox || !box) return;
    if (this.open && !listbox.matches(':popover-open')) {
      listbox.showPopover();
      this.#cleanup = autoUpdate(box, listbox, () => {
        listbox.style.minWidth = `${box.offsetWidth}px`;
        positionFloating(box, listbox, 'bottom-start', 4);
      });
      this.dispatchEvent(new Event('uf-show', { bubbles: true, composed: true }));
    } else if (!this.open && listbox.matches(':popover-open')) {
      listbox.hidePopover();
      this.#cleanup?.();
      this.#cleanup = undefined;
      this.dispatchEvent(new Event('uf-hide', { bubbles: true, composed: true }));
    }
  }

  protected syncFormState(): void {
    const input = this.#input;
    if (!input) return;
    this.internals.setFormValue(this.value);
    this.setValidity({ valueMissing: this.required && !this.value }, this.translator.t('selectItem'), input);
  }

  protected resetValue(): void {
    this.value = this.#initialValue();
    this.#query = null;
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    this.value = state ?? '';
  }

  #select(option: OptionItem): void {
    if (option.disabled) return;
    const changed = option.value !== this.value;
    this.value = option.value;
    this.#query = null;
    this.hide();
    this.markInteracted();
    if (changed) this.emitChange();
  }

  /** Highlights the next or previous enabled row, wrapping around. */
  #move(step: 1 | -1, rows: Row[]): void {
    const enabled = rows.filter((r) => !r.option.disabled);
    if (!enabled.length) return;
    const position = enabled.findIndex((r) => r.index === this.#active);
    const next = position === -1 ? (step === 1 ? 0 : enabled.length - 1) : (position + step + enabled.length) % enabled.length;
    this.#active = enabled[next].index;
    this.requestUpdate();
  }

  /** On opening, highlight the selected option, or the first one. */
  #openWithActive(rows: Row[], fromEnd = false): void {
    const selected = rows.find((r) => r.option.value === this.value && !r.option.disabled);
    const enabled = rows.filter((r) => !r.option.disabled);
    this.#active = selected?.index ?? (fromEnd ? enabled[enabled.length - 1] : enabled[0])?.index ?? -1;
    this.show();
  }

  #onInput = (event: Event): void => {
    this.#query = (event.target as HTMLInputElement).value;
    // Highlight the first match, so Enter picks it.
    this.#active = this.#rows.find((r) => !r.option.disabled)?.index ?? -1;
    this.show();
    this.requestUpdate();
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    const rows = this.#rows;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open || event.altKey) this.#openWithActive(rows);
        else this.#move(1, rows);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.open) this.#openWithActive(rows, true);
        else this.#move(-1, rows);
        break;
      case 'Enter': {
        const row = rows.find((r) => r.index === this.#active);
        if (this.open && row) {
          event.preventDefault();
          this.#select(row.option);
        }
        break;
      }
      case 'Escape':
        if (this.open) {
          event.preventDefault();
          this.hide();
        }
        break;
    }
  };

  /** Leaving the field: accept an exact match, clear on empty text, otherwise revert. */
  #commitText(): void {
    if (this.#query === null) return;
    const text = this.#query.trim().toLowerCase();
    if (!text) {
      if (this.value) {
        this.value = '';
        this.markInteracted();
        this.emitChange();
      }
    } else {
      const match = this.#options.find((o) => !o.disabled && o.label.toLowerCase() === text);
      if (match) this.#select(match);
    }
    this.#query = null;
    this.requestUpdate();
  }

  #onFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next && (this.contains(next) || this.renderRoot.contains(next))) return;
    this.#commitText();
    this.markInteracted();
    this.hide();
  };

  #onToggleClick = (): void => {
    if (this.open) this.hide();
    else this.#openWithActive(this.#rows);
    this.#input?.focus();
  };

  #renderOption(row: Row) {
    const { option } = row;
    const selected = option.value === this.value;
    return html`
      <div
        id=${`${this.#id}-option-${row.index}`}
        class=${classMap({ option: true, active: row.index === this.#active })}
        part="option"
        role="option"
        aria-selected=${selected ? 'true' : 'false'}
        aria-disabled=${option.disabled ? 'true' : 'false'}
        @pointerdown=${(e: Event) => e.preventDefault()}
        @click=${() => this.#select(option)}
        @pointermove=${() => {
          if (!option.disabled && this.#active !== row.index) {
            this.#active = row.index;
            this.requestUpdate();
          }
        }}
      >
        <span class="check">${selected ? iconSvg(icons.check) : nothing}</span>
        ${option.label}
      </div>
    `;
  }

  #renderRows(rows: Row[]) {
    const out = [];
    let group: string | undefined;
    for (const row of rows) {
      if (row.group !== group) {
        group = row.group;
        if (group) out.push(html`<div class="group-label" part="group-label" role="presentation">${group}</div>`);
      }
      out.push(this.#renderOption(row));
    }
    return out;
  }

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const listboxId = `${this.#id}-listbox`;
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');
    const rows = this.#rows;
    const activeId = this.open && this.#active >= 0 ? `${this.#id}-option-${this.#active}` : undefined;
    const text = this.#query ?? this.#selected?.label ?? '';

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
            type="text"
            role="combobox"
            autocomplete="off"
            .value=${live(text)}
            placeholder=${ifDefined(this.placeholder)}
            ?disabled=${this.isDisabled}
            aria-expanded=${this.open ? 'true' : 'false'}
            aria-controls=${listboxId}
            aria-autocomplete="list"
            aria-activedescendant=${ifDefined(activeId)}
            aria-required=${this.required ? 'true' : 'false'}
            aria-invalid=${error ? 'true' : 'false'}
            aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
            @input=${this.#onInput}
            @keydown=${this.#onKeyDown}
            @click=${() => !this.open && this.#openWithActive(this.#rows)}
          />
          <button
            class=${classMap({ toggle: true, open: this.open })}
            part="toggle"
            type="button"
            tabindex="-1"
            aria-label=${this.translator.t('showOptions')}
            ?disabled=${this.isDisabled}
            @pointerdown=${(e: Event) => e.preventDefault()}
            @click=${this.#onToggleClick}
          >
            ${iconSvg(icons['chevron-down'])}
          </button>
        </div>
        <div id=${listboxId} class="listbox" part="listbox" popover="manual" role="listbox" aria-label=${ifDefined(this.label)}>
          ${rows.length ? this.#renderRows(rows) : html`<div class="empty" part="empty" role="option" aria-disabled="true" aria-selected="false">${this.translator.t('noResults')}</div>`}
        </div>
        <div class="sr-only" role="status">
          ${this.open && this.#query !== null ? `${rows.length} ${rows.length === 1 ? 'result' : 'results'}` : ''}
        </div>
      `,
    });
  }
}

defineElement('uf-combobox', UfCombobox);

declare global {
  interface HTMLElementTagNameMap {
    'uf-combobox': UfCombobox;
  }
}
