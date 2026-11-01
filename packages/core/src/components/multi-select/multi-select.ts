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
import { focusRing, hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';

/** A visible option, with its group and its index among visible options. */
interface Row {
  option: OptionItem;
  group?: string;
  index: number;
}

/**
 * A field to pick several options from a list you can search. The picked ones
 * show as chips in the field, each with a remove button. Write options as plain
 * `<option>` and `<optgroup>` children; `selected` ones start picked.
 *
 * It follows the WAI-ARIA combobox pattern with a multi-select listbox: typing
 * filters the list, arrow keys move through it, Enter picks or unpicks an
 * option and keeps the list open, and Backspace in an empty field removes the
 * last chip. With a `name`, every picked value is submitted with the form.
 *
 * @summary Lets users search a list and pick several options.
 * @tag uf-multi-select
 *
 * @slot - `<option>` and `<optgroup>` elements. They are read, not rendered.
 * @slot label - The label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the field. Overrides `hint`.
 *
 * @event input - Fired as the user types in the field (the search text, not the value).
 * @event change - Fired when an option is picked or removed.
 * @event uf-show - The list opened.
 * @event uf-hide - The list closed.
 *
 * @csspart field - The wrapper around label, control, hint and error.
 * @csspart form-label - The label.
 * @csspart box - The bordered box with the chips and the input.
 * @csspart chips - The list of picked options.
 * @csspart chip - A picked option.
 * @csspart chip-remove - A chip's remove button.
 * @csspart input - The native `<input>`.
 * @csspart toggle - The button that opens the list.
 * @csspart listbox - The floating list.
 * @csspart option - Each option.
 * @csspart group-label - Each group heading.
 * @csspart empty - The "no results" message.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-multi-select-max-height - Maximum height of the list before it scrolls.
 * @cssprop --uf-multi-select-chip-bg - Background of the chips.
 * @cssprop --uf-multi-select-chip-color - Text color of the chips.
 * @cssprop --uf-field-bg - Background of the box.
 * @cssprop --uf-field-border-color - Border color of the box.
 * @cssprop --uf-field-radius - Corner radius of the box.
 *
 * @cssstate user-invalid - The value is invalid and the user has interacted with the field.
 */
export class UfMultiSelect extends FormControl {
  static override styles = [
    hostStyles,
    fieldStyles,
    controlBoxStyles,
    css`
      /* Chips and the input wrap onto more lines, inside the box. The toggle stays on the first. */
      .box {
        align-items: flex-start;
        gap: var(--uf-space-1);
        padding-block: 3px;
        padding-inline: 3px 0;
        cursor: text;
      }

      /* Without chips, the text lines up with the other fields'. */
      .chips[hidden] + .native {
        padding-inline-start: calc(var(--_padding) - 3px);
      }

      .values {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--uf-space-1);
        min-width: 0;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: var(--uf-space-1);
        min-width: 0;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.125rem;
        min-height: calc(var(--_height) - 8px);
        padding-inline-start: var(--uf-space-2);
        background: var(--uf-multi-select-chip-bg, var(--uf-color-accent-tint));
        color: var(--uf-multi-select-chip-color, var(--uf-color-on-accent-tint));
        font-size: var(--uf-font-size-sm);
        font-weight: var(--uf-font-weight-medium);
        line-height: 1.2;
      }

      .chip-remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
        width: 1.5rem;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        opacity: 0.75;
      }

      .chip-remove:hover {
        background: color-mix(in srgb, currentColor 16%, transparent);
        opacity: 1;
      }

      .chip-remove:focus-visible {
        ${focusRing}
        outline-offset: 0;
      }

      .chip-remove .icon {
        width: 0.875rem;
        height: 0.875rem;
      }

      /* Narrow enough to stay after the chips, growing to fill the rest of the line. */
      .native {
        flex: 1 1 2rem;
        min-height: calc(var(--_height) - 8px);
      }

      .toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        width: calc(var(--_height) - 2px);
        height: calc(var(--_height) - 2px);
        margin-block: -3px;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--uf-color-text-muted);
        cursor: pointer;
      }

      .toggle:disabled,
      .chip-remove:disabled {
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
        max-height: var(--uf-multi-select-max-height, 16rem);
        padding: var(--uf-space-1) 0;
        overflow: auto;
        border: 1px solid var(--uf-color-border);
        border-radius: var(--uf-radius-control);
        background: var(--uf-color-surface-overlay);
        color: var(--uf-color-text);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-md);
        box-shadow: var(--uf-shadow-overlay);
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

      /* A checkbox look: several options can be picked. */
      .option .check {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        width: 1rem;
        height: 1rem;
        border: 1px solid var(--uf-color-border-strong);
        color: var(--uf-color-on-accent);
      }

      .option[aria-selected='true'] .check {
        border-color: var(--uf-color-accent);
        background: var(--uf-color-accent);
      }

      .option .icon {
        width: 0.875rem;
        height: 0.875rem;
      }

      .option.active {
        background: var(--uf-color-accent-tint);
        color: var(--uf-color-on-accent-tint);
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
    label: {},
    hint: {},
    placeholder: {},
    size: { reflect: true },
    open: { type: Boolean, reflect: true },
  };

  /** The picked options' values, in the order of the options. */
  declare value: string[];
  /** Visible label. */
  declare label: string | undefined;
  /** Help text below the field. */
  declare hint: string | undefined;
  /** Placeholder text in the field, while nothing is picked. */
  declare placeholder: string | undefined;
  /** Size of the field. */
  declare size: FieldSize;
  /** Whether the list is showing. */
  declare open: boolean;

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-multi-select');
  #observer?: MutationObserver;
  #items: Item[] = [];
  #itemsChanged = false;
  #hasInitialized = false;
  /** Text the user typed, to filter the list. */
  #query = '';
  /** Index of the highlighted row among visible options, or -1. */
  #active = -1;
  #cleanup?: () => void;

  constructor() {
    super();
    this.value = [];
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

  get #values(): string[] {
    return Array.isArray(this.value) ? this.value : [];
  }

  /** The picked options, in the order of the options. */
  get #picked(): OptionItem[] {
    const values = new Set(this.#values);
    return this.#options.filter((o) => values.has(o.value));
  }

  /** Options matching the search, in order, with their group. */
  get #rows(): Row[] {
    const query = this.#query.trim().toLowerCase();
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

  #initialValue(): string[] {
    return this.#options.filter((o) => o.selected).map((o) => o.value);
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
    if (this.#itemsChanged) {
      this.#itemsChanged = false;
      // Frameworks often connect the element before appending its options: wait for them.
      if (this.#items.length && !this.#hasInitialized) {
        // Values set before the options were read (e.g. by a framework) win.
        if (!this.#values.length) this.value = this.#initialValue();
        this.#hasInitialized = true;
      }
    }
    if (changed.has('open') && !this.open) {
      this.#query = '';
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
      this.dispatchEvent(new Event('uf-show'));
    } else if (!this.open && listbox.matches(':popover-open')) {
      listbox.hidePopover();
      this.#cleanup?.();
      this.#cleanup = undefined;
      this.dispatchEvent(new Event('uf-hide'));
    }
  }

  protected syncFormState(): void {
    const input = this.#input;
    if (!input) return;
    const values = this.#values;
    // Every value under the same name, like a native <select multiple>.
    const data = new FormData();
    if (this.name) for (const value of values) data.append(this.name, value);
    this.internals.setFormValue(data, JSON.stringify(values));
    this.setValidity({ valueMissing: this.required && !values.length }, this.translator.t('selectItem'), input);
  }

  protected resetValue(): void {
    this.value = this.#initialValue();
    this.#query = '';
  }

  /** @internal */
  formStateRestoreCallback(state: string | null): void {
    try {
      const values: unknown = JSON.parse(state ?? '[]');
      this.value = Array.isArray(values) ? values.map(String) : [];
    } catch {
      this.value = [];
    }
  }

  #setValue(values: string[]): void {
    // In the order of the options, so the value doesn't depend on the clicking order.
    const wanted = new Set(values);
    this.value = this.#options.filter((o) => wanted.has(o.value)).map((o) => o.value);
    this.markInteracted();
    this.emitChange();
  }

  #toggle(option: OptionItem): void {
    if (option.disabled || this.isDisabled) return;
    const values = this.#values;
    this.#setValue(values.includes(option.value) ? values.filter((v) => v !== option.value) : [...values, option.value]);
    // Picking clears the search, so the next option is easy to find.
    if (this.#query) {
      this.#query = '';
      const index = this.#rows.find((r) => r.option.value === option.value)?.index;
      this.#active = index ?? -1;
    }
    this.requestUpdate();
  }

  #remove(option: OptionItem): void {
    if (this.isDisabled) return;
    this.#setValue(this.#values.filter((v) => v !== option.value));
    this.#input?.focus();
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

  #openWithActive(rows: Row[], fromEnd = false): void {
    const enabled = rows.filter((r) => !r.option.disabled);
    this.#active = (fromEnd ? enabled[enabled.length - 1] : enabled[0])?.index ?? -1;
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
          this.#toggle(row.option);
        }
        break;
      }
      case 'Escape':
        if (this.open) {
          event.preventDefault();
          this.hide();
        }
        break;
      case 'Backspace': {
        const last = this.#picked[this.#picked.length - 1];
        if (!this.#query && last) {
          event.preventDefault();
          this.#setValue(this.#values.filter((v) => v !== last.value));
        }
        break;
      }
    }
  };

  #onFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next && (this.contains(next) || this.renderRoot.contains(next))) return;
    this.markInteracted();
    this.hide();
  };

  #onBoxClick = (event: MouseEvent): void => {
    // A click on the box, around the chips, goes to the input; the chips' buttons do their own thing.
    if ((event.target as Element).closest('.chip-remove, .toggle')) return;
    this.#input?.focus();
    if (!this.open) this.#openWithActive(this.#rows);
  };

  #onToggleClick = (): void => {
    if (this.open) this.hide();
    else this.#openWithActive(this.#rows);
    this.#input?.focus();
  };

  #renderOption(row: Row) {
    const { option } = row;
    const selected = this.#values.includes(option.value);
    return html`
      <div
        id=${`${this.#id}-option-${row.index}`}
        class=${classMap({ option: true, active: row.index === this.#active })}
        part="option"
        role="option"
        aria-selected=${selected ? 'true' : 'false'}
        aria-disabled=${option.disabled ? 'true' : 'false'}
        @pointerdown=${(e: Event) => e.preventDefault()}
        @click=${() => this.#toggle(option)}
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
    const chipsId = `${this.#id}-chips`;
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');
    const rows = this.#rows;
    const picked = this.#picked;
    const activeId = this.open && this.#active >= 0 ? `${this.#id}-option-${this.#active}` : undefined;
    const described = [describedBy({ ...ids, hint: this.hint, hasHintSlot, error }), picked.length ? chipsId : ''].filter(Boolean).join(' ');

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
        <div class=${classMap({ box: true, disabled: this.isDisabled })} part="box" @click=${this.#onBoxClick}>
          <div class="values">
            <ul id=${chipsId} class="chips" part="chips" ?hidden=${!picked.length}>
              ${picked.map(
                (option) => html`<li class="chip" part="chip">
                  ${option.label}
                  <button
                    class="chip-remove"
                    part="chip-remove"
                    type="button"
                    aria-label=${this.translator.t('removeOption', { name: option.label })}
                    ?disabled=${this.isDisabled}
                    @click=${() => this.#remove(option)}
                  >
                    ${iconSvg(icons.x)}
                  </button>
                </li>`,
              )}
            </ul>
            <input
              id=${this.#id}
              class="native"
              part="input"
              type="text"
              role="combobox"
              autocomplete="off"
              .value=${live(this.#query)}
              placeholder=${ifDefined(picked.length ? undefined : this.placeholder)}
              ?disabled=${this.isDisabled}
              aria-expanded=${this.open ? 'true' : 'false'}
              aria-controls=${listboxId}
              aria-autocomplete="list"
              aria-activedescendant=${ifDefined(activeId)}
              aria-required=${this.required ? 'true' : 'false'}
              aria-invalid=${error ? 'true' : 'false'}
              aria-describedby=${ifDefined(described || undefined)}
              @input=${this.#onInput}
              @keydown=${this.#onKeyDown}
            />
          </div>
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
        <div
          id=${listboxId}
          class="listbox"
          part="listbox"
          popover="manual"
          role="listbox"
          aria-multiselectable="true"
          aria-label=${ifDefined(this.label)}
        >
          ${rows.length ? this.#renderRows(rows) : html`<div class="empty" part="empty" role="option" aria-disabled="true" aria-selected="false">${this.translator.t('noResults')}</div>`}
        </div>
        <div class="sr-only" role="status">
          ${this.open && this.#query
            ? rows.length === 1
              ? this.translator.t('oneResult')
              : this.translator.t('results', { count: rows.length })
            : ''}
        </div>
      `,
    });
  }
}

defineElement('uf-multi-select', UfMultiSelect);

declare global {
  interface HTMLElementTagNameMap {
    'uf-multi-select': UfMultiSelect;
  }
}
