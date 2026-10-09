import { LitElement, css, html, nothing, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import { iconSvg, icons } from '../../internal/icons.js';

/**
 * An action inside `<uf-menu>`. With `type="checkbox"` it toggles on and off.
 *
 * @summary An item in a menu.
 * @tag uf-menu-item
 *
 * @slot - The label.
 * @slot prefix - An icon before the label.
 * @slot suffix - Trailing content, e.g. a keyboard shortcut.
 *
 * @csspart checkmark - The check shown for checked checkbox items.
 * @csspart label - The label wrapper.
 *
 * @cssstate checked - A checkbox item that is on.
 */
export class UfMenuItem extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: var(--uf-space-2);
      min-height: var(--uf-size-control-sm);
      padding: 0 var(--uf-space-3) 0 var(--uf-space-2);
      color: var(--uf-color-text);
      font-family: var(--uf-font-family-sans);
      font-size: var(--uf-font-size-md);
      line-height: 1.3;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      outline: none;
    }

    :host(:hover),
    :host(:focus) {
      background: var(--uf-color-accent-tint);
      color: var(--uf-color-on-accent-tint);
    }

    :host(:focus-visible) {
      outline: var(--uf-focus-ring-width) solid var(--uf-color-focus-ring);
      outline-offset: calc(var(--uf-focus-ring-width) * -1);
    }

    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
      background: none;
      color: var(--uf-color-text);
    }

    .check {
      display: inline-flex;
      width: 1rem;
      flex: none;
    }

    /* In menus with checkbox items, every label lines up after the check column. */
    :host([data-check-space]:not([type='checkbox'])) {
      padding-inline-start: calc(var(--uf-space-2) * 2 + 1rem);
    }

    .icon {
      width: 1rem;
      height: 1rem;
    }

    .label {
      flex: 1;
    }

    ::slotted([slot='suffix']) {
      margin-inline-start: var(--uf-space-4);
      color: var(--uf-color-text-muted);
      font-size: var(--uf-font-size-sm);
    }

    ::slotted(svg),
    ::slotted(uf-icon) {
      width: 1rem;
      height: 1rem;
    }
  `;

  static override properties: PropertyDeclarations = {
    value: { reflect: true },
    type: { reflect: true },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  /** Identifies the item in the menu's `uf-select` event. */
  declare value: string;
  /** `checkbox` items toggle `checked` when selected. */
  declare type: 'normal' | 'checkbox';
  /** Whether a checkbox item is on. */
  declare checked: boolean;
  /** Disables the item. */
  declare disabled: boolean;

  readonly #internals = this.attachInternals();

  constructor() {
    super();
    this.value = '';
    this.type = 'normal';
    this.checked = false;
    this.disabled = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) this.tabIndex = -1;
  }

  override updated(): void {
    // Real attributes, so every accessibility tool and test library sees them.
    const checkbox = this.type === 'checkbox';
    this.setAttribute('role', checkbox ? 'menuitemcheckbox' : 'menuitem');
    this.setAttribute('aria-disabled', String(this.disabled));
    if (checkbox) this.setAttribute('aria-checked', String(this.checked));
    else this.removeAttribute('aria-checked');
    this.#internals.states?.[checkbox && this.checked ? 'add' : 'delete']('checked');
  }

  override render() {
    return html`
      ${this.type === 'checkbox'
        ? html`<span class="check">${this.checked ? iconSvg(icons.check, 'checkmark') : nothing}</span>`
        : nothing}
      <slot name="prefix"></slot>
      <span class="label" part="label"><slot></slot></span>
      <slot name="suffix"></slot>
    `;
  }
}

defineElement('uf-menu-item', UfMenuItem);

declare global {
  interface HTMLElementTagNameMap {
    'uf-menu-item': UfMenuItem;
  }
}
