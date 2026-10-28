import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import { hostStyles } from '../../internal/shared.styles.js';

/**
 * One option inside `<uf-radio-group>`. The group manages checked state,
 * focus and keyboard navigation.
 *
 * @summary An option in a radio group.
 * @tag uf-radio
 *
 * @slot - The label.
 *
 * @csspart control - The circle.
 * @csspart label - The label text.
 *
 * @cssprop --uf-radio-size - Size of the circle.
 * @cssprop --uf-radio-checked-bg - Color of the circle when checked.
 *
 * @cssstate checked - The radio is selected.
 */
export class UfRadio extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        --_size: var(--uf-radio-size, var(--_circle, 1.125rem));
        display: flex;
        align-items: flex-start;
        gap: var(--uf-space-2);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-md);
        line-height: 1.4;
        color: var(--uf-color-text);
        cursor: pointer;
        outline: none;
      }

      /* The group's size. */
      :host([data-group-size='sm']) {
        --_circle: 1rem;
        font-size: var(--uf-font-size-sm);
      }

      :host([data-group-size='lg']) {
        --_circle: 1.25rem;
        font-size: var(--uf-font-size-lg);
      }

      /* Grey instead of faded, like disabled fields. */
      :host([disabled]),
      :host([data-group-disabled]) {
        color: var(--uf-color-text-muted);
        cursor: not-allowed;
      }

      .control {
        position: relative;
        flex: none;
        width: var(--_size);
        height: var(--_size);
        margin-top: calc((1.4em - var(--_size)) / 2);
        border: 1px solid var(--uf-color-border-strong);
        border-radius: 50%;
        background: var(--uf-color-surface);
        transition: border-color var(--uf-duration-fast) ease;
      }

      :host(:hover:not([disabled], [data-group-disabled])) .control {
        border-color: var(--uf-color-text-muted);
      }

      :host([checked]) .control {
        border: calc(var(--_size) * 0.3) solid var(--uf-radio-checked-bg, var(--uf-color-accent-strong));
      }

      :host([disabled]) .control,
      :host([data-group-disabled]) .control {
        border-color: var(--uf-color-border);
        background: var(--uf-color-neutral-fill);
      }

      :host([disabled][checked]) .control,
      :host([data-group-disabled][checked]) .control {
        border-color: var(--uf-color-text-muted);
      }

      :host([data-invalid]) .control {
        border-color: var(--uf-color-danger-text);
        box-shadow: inset 0 0 0 1px var(--uf-color-danger-text);
      }

      :host(:focus-visible) .control {
        outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
        outline-offset: var(--uf-focus-ring-offset);
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    value: { reflect: true },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  /** Value the group takes when this radio is selected. */
  declare value: string;
  /** Whether this radio is selected. Set by the group. */
  declare checked: boolean;
  /** Disables this option. */
  declare disabled: boolean;

  readonly #internals = this.attachInternals();

  constructor() {
    super();
    this.value = '';
    this.checked = false;
    this.disabled = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Real attributes rather than ElementInternals ARIA, so axe, Testing Library
    // and older assistive tech all see them.
    this.setAttribute('role', 'radio');
  }

  override updated(): void {
    const groupDisabled = this.hasAttribute('data-group-disabled');
    this.setAttribute('aria-checked', String(this.checked));
    this.setAttribute('aria-disabled', String(this.disabled || groupDisabled));
    this.#internals.states?.[this.checked ? 'add' : 'delete']('checked');
  }

  override render() {
    return html`
      <span class="control" part="control"></span>
      <span class="label" part="label"><slot></slot></span>
    `;
  }
}

defineElement('uf-radio', UfRadio);

declare global {
  interface HTMLElementTagNameMap {
    'uf-radio': UfRadio;
  }
}
