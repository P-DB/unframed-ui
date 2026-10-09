import { css } from 'lit';
import { defineElement } from '../../internal/define.js';
import { UfPopover } from '../popover/popover.js';
import '../menu/menu.js';
import type { MenuSelectDetail, UfMenu } from '../menu/menu.js';

export { UfMenu, UfMenuItem } from '../menu/menu.js';
export type { MenuSelectDetail } from '../menu/menu.js';

/**
 * A button that opens a `<uf-menu>`, following the WAI-ARIA menu button
 * pattern: Enter, Space or Down open it on the first item, Up on the last;
 * choosing an item or pressing Escape closes it and returns focus to the button.
 *
 * @summary Opens a menu of actions from a button.
 * @tag uf-dropdown
 *
 * @slot trigger - The button that opens the menu.
 * @slot - A `<uf-menu>`.
 *
 * @event {CustomEvent<MenuSelectDetail>} uf-select - An item was chosen (bubbles up from the menu).
 * @event uf-show - The menu opened.
 * @event uf-hide - The menu closed.
 *
 * @csspart panel - The floating panel around the menu.
 */
export class UfDropdown extends UfPopover {
  static override styles = [
    UfPopover.styles,
    css`
      .panel {
        --uf-popover-padding: var(--uf-space-1) 0;
      }
    `,
  ];

  #focusLastOnOpen = false;

  constructor() {
    super();
    this.addEventListener('uf-select', this.#onSelect as EventListener);
    this.addEventListener('keydown', this.#onKeyDown);
  }

  protected override get popupKind(): 'menu' {
    return 'menu';
  }

  get #menu(): UfMenu | null {
    return this.querySelector('uf-menu');
  }

  protected override afterShow(): void {
    const menu = this.#menu;
    if (this.#focusLastOnOpen) menu?.focusLast();
    else menu?.focusFirst();
    this.#focusLastOnOpen = false;
  }

  protected override onTriggerKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    this.#focusLastOnOpen = event.key === 'ArrowUp';
    if (this.open) this.afterShow();
    else this.show();
  }

  #onSelect = (event: CustomEvent<MenuSelectDetail>): void => {
    // Checkbox items stay open so several can be toggled; cancel the event to keep any item open.
    if (event.defaultPrevented || event.detail.item.type === 'checkbox') return;
    this.hide();
    this.trigger?.focus();
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    // Tab leaves the menu: close it and let focus move on.
    if (event.key === 'Tab' && this.open && this.focusInPanel) this.hide();
  };
}

defineElement('uf-dropdown', UfDropdown);

declare global {
  interface HTMLElementTagNameMap {
    'uf-dropdown': UfDropdown;
  }
}
