import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { defineElement } from '../../internal/define.js';
import './accordion-item.js';
import type { UfAccordionItem } from './accordion-item.js';

export { UfAccordionItem } from './accordion-item.js';

/**
 * Groups `<uf-accordion-item>`s. By default opening one item closes the
 * others; set `multiple` to let several stay open. Up and Down arrows move
 * between headers, Home and End jump to the first and last.
 *
 * @summary A stack of sections that expand and collapse.
 * @tag uf-accordion
 *
 * @slot - `<uf-accordion-item>` elements.
 *
 * @csspart base - The wrapper around the items.
 */
export class UfAccordion extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border-top: 1px solid var(--uf-color-border);
    }
  `;

  static override properties: PropertyDeclarations = {
    multiple: { type: Boolean, reflect: true },
  };

  /** Allows several items to be open at once. */
  declare multiple: boolean;

  constructor() {
    super();
    this.multiple = false;
    // uf-show doesn't bubble, but it still passes through ancestors while capturing.
    this.addEventListener('uf-show', this.#onShow, { capture: true });
    this.addEventListener('keydown', this.#onKeyDown);
  }

  get #items(): UfAccordionItem[] {
    return [...this.querySelectorAll<UfAccordionItem>(':scope > uf-accordion-item')];
  }

  #onShow = (event: Event): void => {
    if (this.multiple) return;
    const opened = event.target as UfAccordionItem;
    if (opened.parentElement !== this) return;
    for (const item of this.#items) if (item !== opened) item.hide();
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    const item = (event.target as Element).closest('uf-accordion-item');
    // Only react to keys on a header, not inside the content.
    if (!item || item.parentElement !== this || event.composedPath()[0] !== item.header) return;

    const items = this.#items.filter((i) => !i.disabled);
    const index = items.indexOf(item);
    const target = {
      ArrowDown: items[(index + 1) % items.length],
      ArrowUp: items[(index - 1 + items.length) % items.length],
      Home: items[0],
      End: items[items.length - 1],
    }[event.key];
    if (!target) return;
    event.preventDefault();
    target.focus();
  };

  override render() {
    return html`<div part="base"><slot></slot></div>`;
  }
}

defineElement('uf-accordion', UfAccordion);

declare global {
  interface HTMLElementTagNameMap {
    'uf-accordion': UfAccordion;
  }
}
