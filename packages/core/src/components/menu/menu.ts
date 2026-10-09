import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import './menu-item.js';
import type { UfMenuItem } from './menu-item.js';

export { UfMenuItem } from './menu-item.js';

export interface MenuSelectDetail {
  item: UfMenuItem;
  value: string;
}

/**
 * A list of actions with full keyboard support: arrow keys, Home and End,
 * and typing a letter jumps to the next item starting with it. Use `<hr>`
 * between items for a separator. Usually placed inside `<uf-dropdown>`.
 *
 * @summary A list of actions or options.
 * @tag uf-menu
 *
 * @slot - `<uf-menu-item>` elements and `<hr>` separators.
 *
 * @event {CustomEvent<MenuSelectDetail>} uf-select - An item was chosen. Cancel it to keep a dropdown open.
 */
export class UfMenu extends LitElement {
  static override styles = css`
    :host {
      display: block;
      min-width: 10rem;
      outline: none;
    }

    ::slotted(hr) {
      height: 1px;
      margin: var(--uf-space-1) 0;
      border: 0;
      background: var(--uf-color-border);
    }
  `;

  static override properties: PropertyDeclarations = {
    label: {},
  };

  /** Accessible name of the menu. */
  declare label: string | undefined;

  #typeahead = '';
  #typeaheadTimer = 0;

  constructor() {
    super();
    this.addEventListener('click', this.#onClick);
    this.addEventListener('keydown', this.#onKeyDown);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'menu');
  }

  override updated(): void {
    if (this.label) this.setAttribute('aria-label', this.label);
    else this.removeAttribute('aria-label');
    this.#alignItems();
  }

  /** Reserves the check column on every item when any item is a checkbox. */
  #alignItems(): void {
    const items = [...this.querySelectorAll('uf-menu-item')].filter((i) => i.closest('uf-menu') === this);
    const hasCheckbox = items.some((i) => i.type === 'checkbox');
    for (const item of items) item.toggleAttribute('data-check-space', hasCheckbox);
  }

  /** Enabled items that belong to this menu (not to a nested one). */
  get items(): UfMenuItem[] {
    return [...this.querySelectorAll<UfMenuItem>('uf-menu-item')].filter(
      (item) => item.closest('uf-menu') === this && !item.disabled,
    );
  }

  /** Focuses the first enabled item. */
  focusFirst(): void {
    this.#focusItem(this.items[0]);
  }

  /** Focuses the last enabled item. */
  focusLast(): void {
    const items = this.items;
    this.#focusItem(items[items.length - 1]);
  }

  #focusItem(item: UfMenuItem | undefined): void {
    if (!item) return;
    for (const other of this.items) other.tabIndex = other === item ? 0 : -1;
    item.focus();
  }

  #activate(item: UfMenuItem): void {
    if (item.disabled) return;
    if (item.type === 'checkbox') item.checked = !item.checked;
    this.dispatchEvent(
      new CustomEvent<MenuSelectDetail>('uf-select', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { item, value: item.value },
      }),
    );
  }

  #onClick = (event: MouseEvent): void => {
    const item = (event.target as Element).closest('uf-menu-item');
    if (item && item.closest('uf-menu') === this) this.#activate(item);
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    const items = this.items;
    const current = (event.target as Element).closest('uf-menu-item');
    const index = current ? items.indexOf(current) : -1;

    switch (event.key) {
      case 'ArrowDown':
        this.#focusItem(items[(index + 1) % items.length]);
        break;
      case 'ArrowUp':
        this.#focusItem(items[(index - 1 + items.length) % items.length]);
        break;
      case 'Home':
        this.#focusItem(items[0]);
        break;
      case 'End':
        this.#focusItem(items[items.length - 1]);
        break;
      case 'Enter':
      case ' ':
        if (current) this.#activate(current);
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          this.#onTypeahead(event.key, items, index);
          break;
        }
        return;
    }
    event.preventDefault();
  };

  /** Jumps to the next item whose label starts with the typed characters. */
  #onTypeahead(key: string, items: UfMenuItem[], index: number): void {
    clearTimeout(this.#typeaheadTimer);
    this.#typeaheadTimer = window.setTimeout(() => (this.#typeahead = ''), 500);
    this.#typeahead += key.toLowerCase();
    // Repeating one letter cycles through the items that start with it.
    const search = /^(.)\1*$/.test(this.#typeahead) ? this.#typeahead[0] : this.#typeahead;
    const ordered = [...items.slice(index + 1), ...items.slice(0, index + 1)];
    const match = ordered.find((item) => item.textContent?.trim().toLowerCase().startsWith(search));
    this.#focusItem(match);
  }

  override render() {
    return html`<slot @slotchange=${() => this.#alignItems()}></slot>`;
  }
}

defineElement('uf-menu', UfMenu);

declare global {
  interface HTMLElementTagNameMap {
    'uf-menu': UfMenu;
  }
}
