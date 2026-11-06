import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import { hostStyles } from '../../internal/shared.styles.js';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';

/**
 * Related buttons joined into one bar, like "Bold / Italic / Underline" or
 * "Save" with a menu of other ways to save. For one choice among a few, use
 * `<uf-segmented-control>` instead.
 *
 * Neighbors share one border, and only the outer corners are rounded. Filled
 * and ghost buttons get a thin line between them. Buttons can be wrapped, in a
 * `<uf-tooltip>` or as the trigger of a `<uf-dropdown>`, and stay joined.
 *
 * It's a group for assistive tech: give it a `label` that says what the
 * buttons have in common.
 *
 * @summary Joins related buttons into one bar.
 * @tag uf-button-group
 *
 * @slot - `<uf-button>` elements, alone or wrapped in a tooltip or dropdown.
 */
export class UfButtonGroup extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        --_radius: var(--uf-button-radius, var(--uf-radius-control));
        --_divider: color-mix(in srgb, currentColor 30%, transparent);
        display: inline-flex;
        vertical-align: middle;
      }

      :host([orientation='vertical']) {
        flex-direction: column;
      }

      /*
       * The buttons read these private properties. Custom properties pass through
       * wrappers, so a button inside a tooltip or a dropdown gets them too.
       * A button on its own keeps its corners.
       */
      ::slotted(:not(:first-child):not(:last-child)) {
        --_uf-group-radius: 0;
      }

      ::slotted(:first-child:not(:last-child)) {
        --_uf-group-radius: var(--_radius) 0 0 var(--_radius);
      }

      ::slotted(:last-child:not(:first-child)) {
        --_uf-group-radius: 0 var(--_radius) var(--_radius) 0;
      }

      /* One border between neighbors, and a line between filled and ghost buttons. */
      ::slotted(:not(:first-child)) {
        --_uf-group-border-width: 1px 1px 1px 0;
        --_uf-group-divider: inset 1px 0 0 var(--_divider);
      }

      :host(:dir(rtl)) ::slotted(:first-child:not(:last-child)) {
        --_uf-group-radius: 0 var(--_radius) var(--_radius) 0;
      }

      :host(:dir(rtl)) ::slotted(:last-child:not(:first-child)) {
        --_uf-group-radius: var(--_radius) 0 0 var(--_radius);
      }

      :host(:dir(rtl)) ::slotted(:not(:first-child)) {
        --_uf-group-border-width: 1px 0 1px 1px;
        --_uf-group-divider: inset -1px 0 0 var(--_divider);
      }

      /* After the RTL rules: a vertical group is the same in both directions. */
      :host([orientation='vertical']) ::slotted(:first-child:not(:last-child)) {
        --_uf-group-radius: var(--_radius) var(--_radius) 0 0;
      }

      :host([orientation='vertical']) ::slotted(:last-child:not(:first-child)) {
        --_uf-group-radius: 0 0 var(--_radius) var(--_radius);
      }

      :host([orientation='vertical']) ::slotted(:not(:first-child)) {
        --_uf-group-border-width: 0 1px 1px;
        --_uf-group-divider: inset 0 1px 0 var(--_divider);
      }

      /* The focus ring above the neighbors, not under the next button. */
      ::slotted(:focus-within) {
        position: relative;
        z-index: 1;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    label: {},
    orientation: { reflect: true },
  };

  /** What the buttons have in common, for assistive tech. */
  declare label: string | undefined;
  /** Side by side, or stacked. */
  declare orientation: ButtonGroupOrientation;

  constructor() {
    super();
    this.orientation = 'horizontal';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'group');
  }

  override updated(): void {
    if (this.label) this.setAttribute('aria-label', this.label);
    else this.removeAttribute('aria-label');
  }

  override render() {
    return html`<slot></slot>`;
  }
}

defineElement('uf-button-group', UfButtonGroup);

declare global {
  interface HTMLElementTagNameMap {
    'uf-button-group': UfButtonGroup;
  }
}
