import { css, html, type PropertyDeclarations } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { defineElement } from '../../internal/define.js';
import { describedBy } from '../../internal/field.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { hostStyles } from '../../internal/shared.styles.js';
import { HasSlotController, uniqueId } from '../../internal/slot.js';
import { ToggleControl } from '../../internal/toggle-control.js';
import { toggleStyles } from '../../internal/toggle.styles.js';

/**
 * A checkbox with its label as content.
 *
 * @summary Lets users turn an option on or off, or pick several options.
 * @tag uf-checkbox
 *
 * @slot - The label.
 * @slot hint - Help text below the label. Overrides `hint`.
 *
 * @event input - Fired when the checked state changes.
 * @event change - Fired when the checked state changes.
 *
 * @csspart base - The `<label>` wrapping control and label.
 * @csspart control - The box.
 * @csspart checkmark - The check or dash icon.
 * @csspart label - The label text.
 * @csspart hint - The hint text.
 * @csspart error - The validation message.
 *
 * @cssprop --uf-checkbox-size - Size of the box.
 * @cssprop --uf-checkbox-radius - Corner radius of the box.
 * @cssprop --uf-checkbox-checked-bg - Background when checked.
 * @cssprop --uf-checkbox-indeterminate-bg - Background when indeterminate. Defaults to the checked background.
 *
 * @cssstate checked - The checkbox is checked.
 * @cssstate indeterminate - The checkbox shows a dash ("some selected").
 * @cssstate user-invalid - Required but unchecked, after the user interacted.
 */
export class UfCheckbox extends ToggleControl {
  static override styles = [
    hostStyles,
    toggleStyles,
    css`
      :host {
        --_control-width: var(--uf-checkbox-size, 1.125rem);
        --_control-height: var(--uf-checkbox-size, 1.125rem);
      }

      .native {
        width: var(--_control-width);
        height: var(--_control-height);
        border: 1px solid var(--uf-color-border-strong);
        border-radius: var(--uf-checkbox-radius, var(--uf-radius-control));
        background: var(--uf-color-surface);
      }

      .native:hover:not(:disabled) {
        border-color: var(--uf-color-text-muted);
      }

      .native:checked,
      .native:indeterminate {
        border-color: transparent;
        background: var(--uf-checkbox-checked-bg, var(--uf-color-accent));
      }

      .native:indeterminate {
        background: var(--uf-checkbox-indeterminate-bg, var(--uf-checkbox-checked-bg, var(--uf-color-accent)));
      }

      .disabled .native {
        border-color: var(--uf-color-border);
        background: var(--uf-color-neutral-fill);
      }

      .disabled .native:checked,
      .disabled .native:indeterminate {
        border-color: transparent;
        background: var(--uf-color-text-muted);
      }

      .disabled .icon {
        color: var(--uf-color-surface);
      }

      .invalid .native {
        border-color: var(--uf-color-danger-text);
        box-shadow: inset 0 0 0 1px var(--uf-color-danger-text);
      }

      .icon {
        position: absolute;
        inset: 0;
        margin: auto;
        width: 80%;
        height: 80%;
        color: var(--uf-color-on-accent);
        stroke-width: 3;
        pointer-events: none;
        opacity: 0;
      }

      .native:checked + .icon,
      .native:indeterminate + .icon {
        opacity: 1;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    indeterminate: { type: Boolean, reflect: true },
    selectAll: { type: Boolean, reflect: true, attribute: 'select-all' },
    hint: {},
  };

  /** Shows a dash instead of a check, for "some selected". Cleared when the user clicks. */
  declare indeterminate: boolean;
  /**
   * Inside `<uf-checkbox-group>`: checks or unchecks every other checkbox in the
   * group, and shows checked, unchecked or indeterminate to match them.
   */
  declare selectAll: boolean;
  /** Help text below the label. */
  declare hint: string | undefined;

  readonly #slots = new HasSlotController(this, 'hint');
  readonly #id = uniqueId('uf-checkbox');

  constructor() {
    super();
    this.indeterminate = false;
    this.selectAll = false;
  }

  override updated(): void {
    super.updated();
    this.internals.states?.[this.indeterminate ? 'add' : 'delete']('indeterminate');
  }

  #onChange = (event: Event): void => {
    this.indeterminate = false;
    this.onNativeChange(event);
  };

  override render() {
    const ids = { hintId: `${this.#id}-hint`, errorId: `${this.#id}-error` };
    const error = this.showInvalid ? this.validationMessage : '';
    const hasHintSlot = this.#slots.has('hint');
    const disabled = this.isDisabled;

    return html`
      <label class=${classMap({ root: true, disabled, invalid: Boolean(error) })} part="base">
        <span class="control" part="control">
          <input
            class="native"
            type="checkbox"
            name=${ifDefined(this.name || undefined)}
            .value=${this.value}
            .checked=${live(this.checked)}
            .indeterminate=${live(this.indeterminate)}
            ?required=${this.required}
            ?disabled=${disabled}
            aria-invalid=${error ? 'true' : 'false'}
            aria-describedby=${ifDefined(describedBy({ ...ids, hint: this.hint, hasHintSlot, error }))}
            @change=${this.#onChange}
          />
          ${iconSvg(this.indeterminate ? icons.minus : icons.check, 'checkmark')}
        </span>
        <span class="label" part="label"><slot></slot></span>
      </label>
      <div id=${ids.hintId} class="hint" part="hint" ?hidden=${!this.hint && !hasHintSlot}>
        <slot name="hint">${this.hint}</slot>
      </div>
      <div id=${ids.errorId} class="error" part="error" ?hidden=${!error}>${error}</div>
    `;
  }
}

defineElement('uf-checkbox', UfCheckbox);

declare global {
  interface HTMLElementTagNameMap {
    'uf-checkbox': UfCheckbox;
  }
}
