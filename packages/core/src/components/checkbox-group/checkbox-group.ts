import { LitElement, css, html, nothing, type PropertyDeclarations } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineElement } from '../../internal/define.js';
import { fieldStyles } from '../../internal/field.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { syncSelectAll } from '../../internal/select-all.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';
import '../checkbox/checkbox.js';
import type { UfCheckbox } from '../checkbox/checkbox.js';

/**
 * Groups related `<uf-checkbox>`es under one label. Mark one checkbox with
 * `select-all` to get the "select all" pattern: it checks or unchecks the
 * others, and turns indeterminate when only some are checked.
 *
 * Each checkbox still submits its own `name` and `value` with a form;
 * `value` on the group lists the checked values, for frameworks.
 *
 * @summary Groups checkboxes, with an optional "select all".
 * @tag uf-checkbox-group
 *
 * @slot - `<uf-checkbox>` elements.
 * @slot label - The group label, when you need markup. Overrides `label`.
 * @slot hint - Help text below the checkboxes. Overrides `hint`.
 *
 * @event change - A checkbox in the group changed (including through "select all").
 *
 * @csspart base - The element with `role="group"`.
 * @csspart form-label - The group label.
 * @csspart options - The wrapper around the checkboxes.
 * @csspart hint - The hint text.
 *
 * @cssprop --uf-checkbox-group-indent - Indent of the checkboxes under a "select all".
 */
export class UfCheckboxGroup extends LitElement {
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

      /* The checkboxes controlled by "select all" sit indented under it. */
      .has-select-all ::slotted(uf-checkbox:not([select-all])) {
        margin-inline-start: var(--uf-checkbox-group-indent, calc(1.125rem + var(--uf-space-2)));
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    label: {},
    hint: {},
    orientation: { reflect: true },
  };

  /** Visible group label. */
  declare label: string | undefined;
  /** Help text below the checkboxes. */
  declare hint: string | undefined;
  /** Lays the checkboxes out in a column or a row. */
  declare orientation: 'vertical' | 'horizontal';

  readonly #slots = new HasSlotController(this, 'label', 'hint');
  readonly #id = uniqueId('uf-checkbox-group');

  constructor() {
    super();
    this.orientation = 'vertical';
    // Runs before listeners added later (e.g. a framework's), so they see the synced state.
    this.addEventListener('change', this.#onChange);
  }

  get #selectAll(): UfCheckbox | null {
    return this.querySelector<UfCheckbox>('uf-checkbox[select-all]');
  }

  /** The checkboxes in the group, other than "select all". */
  get #options(): UfCheckbox[] {
    return [...this.querySelectorAll<UfCheckbox>('uf-checkbox')].filter((c) => !c.selectAll);
  }

  /** The values of the checked checkboxes (other than "select all"). */
  get value(): string[] {
    return this.#options.filter((c) => c.checked).map((c) => c.value);
  }

  set value(values: string[]) {
    const wanted = new Set(values ?? []);
    this.#updateOptions((option) => wanted.has(option.value));
  }

  /** True while the group checks options itself, so they don't each update "select all" halfway. */
  #updatingOptions = false;

  #updateOptions(checked: (option: UfCheckbox) => boolean): void {
    this.#updatingOptions = true;
    try {
      for (const option of this.#options) option.checked = checked(option);
    } finally {
      this.#updatingOptions = false;
    }
    this[syncSelectAll]();
  }

  /** Updates "select all" to match the other checkboxes. The checkboxes call it when they change. @internal */
  [syncSelectAll](): void {
    const selectAll = this.#selectAll;
    if (!selectAll || this.#updatingOptions) return;
    const options = this.#options;
    const checked = options.filter((c) => c.checked).length;
    selectAll.checked = checked > 0 && checked === options.length;
    selectAll.indeterminate = checked > 0 && checked < options.length;
  }

  #onChange = (event: Event): void => {
    const target = event.target as UfCheckbox;
    if (target.localName !== 'uf-checkbox' || !this.contains(target)) return;
    if (target.selectAll) {
      const checked = target.checked;
      // Disabled checkboxes keep their state, like any control the user can't change.
      this.#updateOptions((option) => (option.disabled ? option.checked : checked));
    } else {
      this[syncSelectAll]();
    }
  };

  override render() {
    const labelId = `${this.#id}-label`;
    const hintId = `${this.#id}-hint`;
    const hasLabel = Boolean(this.label) || this.#slots.has('label');
    const hasHint = Boolean(this.hint) || this.#slots.has('hint');

    return html`
      <div
        class=${classMap({ field: true, 'has-select-all': Boolean(this.#selectAll) })}
        part="base"
        role="group"
        aria-labelledby=${ifDefined(hasLabel ? labelId : undefined)}
        aria-describedby=${ifDefined(hasHint ? hintId : undefined)}
      >
        <div id=${labelId} class="field-label" part="form-label" ?hidden=${!hasLabel}>
          <slot name="label">${this.label}</slot>
        </div>
        <div class="options" part="options">
          <slot
            @slotchange=${() => {
              this[syncSelectAll]();
              this.requestUpdate();
            }}
          ></slot>
        </div>
        <div id=${hintId} class="field-hint" part="hint" ?hidden=${!hasHint}>
          <slot name="hint">${this.hint ?? nothing}</slot>
        </div>
      </div>
    `;
  }
}

defineElement('uf-checkbox-group', UfCheckboxGroup);

declare global {
  interface HTMLElementTagNameMap {
    'uf-checkbox-group': UfCheckboxGroup;
  }
}
