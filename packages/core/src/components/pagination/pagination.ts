import { LitElement, css, html, type PropertyDeclarations } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { defineElement } from '../../internal/define.js';
import { Translator } from '../../internal/i18n.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { focusRing, hostStyles } from '../../internal/shared.styles.js';

export type PaginationSize = 'sm' | 'md';

export interface PageChangeDetail {
  /** The new page, from 1. */
  page: number;
}

type Item = number | 'start-ellipsis' | 'end-ellipsis';

/**
 * The page buttons to show: the first and last pages, the current page with
 * `siblings` pages on each side, and an ellipsis for the gaps. The number of
 * items stays the same from page to page, so the buttons don't jump around.
 */
function pageItems(page: number, pages: number, siblings: number): Item[] {
  // Enough room to show everything: first, last, current, siblings and two ellipses.
  if (pages <= 2 * siblings + 5) return Array.from({ length: pages }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(page - siblings, pages - 2 * siblings - 2));
  const end = Math.min(pages - 1, Math.max(page + siblings, 2 * siblings + 3));
  const items: Item[] = [1];
  if (start > 2) items.push('start-ellipsis');
  for (let p = start; p <= end; p++) items.push(p);
  if (end < pages - 1) items.push('end-ellipsis');
  items.push(pages);
  return items;
}

/**
 * Navigation between the pages of a list or table. Set `pages` and `page`; the
 * user changes `page`, and `uf-page-change` tells you which page to show.
 *
 * It's a navigation landmark: when a page has more than one, give each a
 * different `label`.
 *
 * @summary Moves between the pages of a long list.
 * @tag uf-pagination
 *
 * @event {CustomEvent<PageChangeDetail>} uf-page-change - The user chose another page.
 *
 * @csspart base - The `<nav>`.
 * @csspart list - The list of buttons.
 * @csspart button - Every button: pages, previous and next.
 * @csspart current - The current page's button.
 * @csspart previous - The previous button.
 * @csspart next - The next button.
 * @csspart ellipsis - The "…" between pages.
 *
 * @cssprop --uf-pagination-gap - Space between the buttons.
 */
export class UfPagination extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
        --_size: var(--uf-size-control-md);
      }

      :host([size='sm']) {
        --_size: var(--uf-size-control-sm);
      }

      .list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--uf-pagination-gap, var(--uf-space-1));
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-sm);
      }

      .button {
        display: inline-grid;
        place-items: center;
        min-width: var(--_size);
        height: var(--_size);
        padding: 0 var(--uf-space-2);
        border: 1px solid transparent;
        border-radius: var(--uf-radius-control);
        background: transparent;
        color: var(--uf-color-text);
        font: inherit;
        font-variant-numeric: tabular-nums;
        cursor: pointer;
        transition: background-color var(--uf-duration-fast) ease;
      }

      .button:hover:not(:disabled) {
        background: var(--uf-color-accent-tint);
        color: var(--uf-color-on-accent-tint);
      }

      .button:focus-visible {
        ${focusRing}
      }

      .button:disabled {
        color: var(--uf-color-text-muted);
        cursor: not-allowed;
        opacity: 0.5;
      }

      .current,
      .current:hover:not(:disabled) {
        background: var(--uf-color-accent);
        color: var(--uf-color-on-accent);
        font-weight: var(--uf-font-weight-semibold);
      }

      .arrow svg {
        width: 1.125em;
        height: 1.125em;
      }

      .ellipsis {
        display: inline-grid;
        place-items: center;
        min-width: var(--_size);
        color: var(--uf-color-text-muted);
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    page: { type: Number, reflect: true },
    pages: { type: Number },
    siblings: { type: Number },
    label: {},
    size: { reflect: true },
  };

  /** The current page, from 1. */
  declare page: number;
  /** How many pages there are. */
  declare pages: number;
  /** How many pages to show on each side of the current one. */
  declare siblings: number;
  /** Accessible name of the navigation, e.g. "Search results pages". Defaults to "Pagination", or its translation. */
  declare label: string | undefined;
  /** Size: `sm` or `md`. */
  declare size: PaginationSize;

  readonly #translator = new Translator(this);

  constructor() {
    super();
    this.page = 1;
    this.pages = 1;
    this.siblings = 1;
    this.size = 'md';
  }

  /** The current page, kept between 1 and `pages`. */
  get #current(): number {
    return Math.min(Math.max(1, Math.round(this.page) || 1), Math.max(1, this.pages));
  }

  #go(page: number): void {
    if (page === this.#current || page < 1 || page > this.pages) return;
    this.page = page;
    this.dispatchEvent(new CustomEvent<PageChangeDetail>('uf-page-change', { bubbles: true, composed: true, detail: { page } }));
  }

  override render() {
    const current = this.#current;
    const pages = Math.max(1, Math.floor(this.pages) || 1);
    const items = pageItems(current, pages, Math.max(0, Math.floor(this.siblings)));

    return html`<nav part="base" aria-label=${this.label ?? this.#translator.t('pagination')}>
      <ul class="list" part="list">
        <li>
          <button
            class="button arrow"
            part="button previous"
            type="button"
            aria-label=${this.#translator.t('previousPage')}
            ?disabled=${current <= 1}
            @click=${() => this.#go(this.#current - 1)}
          >
            ${iconSvg(icons['chevron-left'])}
          </button>
        </li>
        ${repeat(
          items,
          (item) => item,
          (item) =>
            typeof item === 'number'
              ? html`<li>
                  <button
                    class=${classMap({ button: true, current: item === current })}
                    part=${item === current ? 'button current' : 'button'}
                    type="button"
                    aria-label=${this.#translator.t('page', { page: item })}
                    aria-current=${item === current ? 'page' : 'false'}
                    @click=${() => this.#go(item)}
                  >
                    ${item}
                  </button>
                </li>`
              : html`<li class="ellipsis" part="ellipsis" aria-hidden="true">…</li>`,
        )}
        <li>
          <button
            class="button arrow"
            part="button next"
            type="button"
            aria-label=${this.#translator.t('nextPage')}
            ?disabled=${current >= pages}
            @click=${() => this.#go(this.#current + 1)}
          >
            ${iconSvg(icons['chevron-right'])}
          </button>
        </li>
      </ul>
    </nav>`;
  }
}

defineElement('uf-pagination', UfPagination);

declare global {
  interface HTMLElementTagNameMap {
    'uf-pagination': UfPagination;
  }
}
