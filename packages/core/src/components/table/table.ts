import { LitElement, css, html, nothing, type PropertyDeclarations, type PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { defineElement } from '../../internal/define.js';
import { Translator } from '../../internal/i18n.js';
import { iconSvg, icons } from '../../internal/icons.js';
import { focusRing, hostStyles } from '../../internal/shared.styles.js';

/** A row of data: column keys to values. */
export type TableRow = Record<string, unknown>;
export type SortDirection = 'ascending' | 'descending';
export type TableDensity = 'comfortable' | 'compact';

export interface TableColumn<Row extends TableRow = TableRow> {
  /** The row property this column shows, and its id for sorting. */
  key: string;
  /** Header text. */
  label: string;
  /** Lets the user sort by this column. */
  sortable?: boolean;
  /** Text alignment. Use `end` for numbers. Defaults to `start`. */
  align?: 'start' | 'center' | 'end';
  /** Column width, as CSS: `8rem`, `20%`. */
  width?: string;
  /** Cell content from the value: text, or a DOM node such as a badge. Defaults to the value as text. */
  format?: (value: unknown, row: Row) => string | number | Node | null | undefined;
  /** Sort order for two rows, like `Array.prototype.sort`. Defaults to comparing the values. */
  compare?: (a: Row, b: Row) => number;
}

export interface TableSortDetail {
  /** Key of the sorted column. */
  key: string;
  direction: SortDirection;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/** Numbers and dates by value, everything else as text; empty values last. */
function compareValues(a: unknown, b: unknown): number {
  const empty = (v: unknown) => v === null || v === undefined || v === '';
  if (empty(a) || empty(b)) return Number(empty(a)) - Number(empty(b));
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return collator.compare(String(a), String(b));
}

/**
 * A table of data, from `columns` and `rows`. Users can sort by the columns
 * marked `sortable`. Rendered as a native `<table>`, so assistive tech reads
 * headers and cells as usual.
 *
 * Set `columns` and `rows` as properties, or as JSON attributes in plain HTML.
 * The table sorts `rows` itself; with `manual-sort` it only shows the order
 * and tells you, so you can sort on the server. Combine it with
 * `<uf-pagination>` for long lists.
 *
 * @summary Shows data in rows and columns, with sorting.
 * @tag uf-table
 *
 * @slot empty - Shown when there are no rows. Defaults to "No data", or its translation.
 *
 * @event {CustomEvent<TableSortDetail>} uf-sort - The user sorted by a column.
 *
 * @csspart base - The scroll container around the table.
 * @csspart table - The `<table>`.
 * @csspart header-cell - Every header cell (`<th>`).
 * @csspart sort-button - The button in a sortable header.
 * @csspart row - Every body row.
 * @csspart cell - Every body cell.
 * @csspart empty - The cell shown when there are no rows.
 *
 * @cssprop --uf-table-max-height - Height after which the body scrolls under a sticky header.
 * @cssprop --uf-table-border-color - Border color between rows.
 * @cssprop --uf-table-header-bg - Background of the header row.
 * @cssprop --uf-table-stripe-bg - Background of every other row, with `striped`.
 * @cssprop --uf-table-hover-bg - Background of the row under the pointer.
 */
export class UfTable extends LitElement {
  static override styles = [
    hostStyles,
    css`
      :host {
        display: block;
        --_pad-y: var(--uf-space-3);
        --_pad-x: var(--uf-space-4);
        --_border: var(--uf-table-border-color, var(--uf-color-border));
      }

      :host([density='compact']) {
        --_pad-y: var(--uf-space-1);
        --_pad-x: var(--uf-space-3);
      }

      .base {
        max-height: var(--uf-table-max-height, none);
        overflow: auto;
        border: 1px solid var(--_border);
        border-radius: var(--uf-radius-md);
      }

      .base:focus-visible {
        ${focusRing}
      }

      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        color: var(--uf-color-text);
        font-family: var(--uf-font-family-sans);
        font-size: var(--uf-font-size-sm);
        font-variant-numeric: tabular-nums;
      }

      th,
      td {
        padding: var(--_pad-y) var(--_pad-x);
        border-bottom: 1px solid var(--_border);
        text-align: start;
        vertical-align: middle;
      }

      tbody tr:last-child td {
        border-bottom: 0;
      }

      th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--uf-table-header-bg, var(--uf-color-surface-raised));
        color: var(--uf-color-text-muted);
        font-weight: var(--uf-font-weight-semibold);
        white-space: nowrap;
      }

      .align-center {
        text-align: center;
      }
      .align-end {
        text-align: end;
      }

      .sort {
        display: inline-flex;
        align-items: center;
        gap: var(--uf-space-1);
        margin: calc(var(--uf-space-1) * -1) calc(var(--uf-space-2) * -1);
        padding: var(--uf-space-1) var(--uf-space-2);
        border: 0;
        border-radius: var(--uf-radius-sm);
        background: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
      }

      .sort:hover {
        color: var(--uf-color-text);
      }

      .sort:focus-visible {
        ${focusRing}
      }

      .sort svg {
        width: 1em;
        height: 1em;
        opacity: 0;
      }

      /* A hint on hover and focus, solid when sorted. */
      .sort:hover svg,
      .sort:focus-visible svg {
        opacity: 0.5;
      }
      [aria-sort] .sort {
        color: var(--uf-color-text);
      }
      [aria-sort] .sort svg {
        opacity: 1;
      }

      :host([striped]) tbody tr:nth-child(even) td {
        background: var(--uf-table-stripe-bg, var(--uf-color-surface-hover));
      }

      tbody tr:hover td {
        background: var(--uf-table-hover-bg, var(--uf-color-accent-tint));
      }

      .empty {
        padding: var(--uf-space-6) var(--_pad-x);
        color: var(--uf-color-text-muted);
        text-align: center;
      }

      tbody tr.empty-row:hover td {
        background: none;
      }
    `,
  ];

  static override properties: PropertyDeclarations = {
    columns: { type: Array },
    rows: { type: Array },
    label: {},
    sortKey: { attribute: 'sort-key', reflect: true },
    sortDirection: { attribute: 'sort-direction', reflect: true },
    manualSort: { type: Boolean, attribute: 'manual-sort' },
    rowKey: { attribute: 'row-key' },
    striped: { type: Boolean, reflect: true },
    density: { reflect: true },
  };

  /** The columns, in order. As an attribute, JSON: `[{"key": "name", "label": "Name"}]`. */
  declare columns: TableColumn[];
  /** The data, one object per row. As an attribute, JSON: `[{"name": "John"}]`. */
  declare rows: TableRow[];
  /** Accessible name of the table, e.g. "Invoices". */
  declare label: string | undefined;
  /** Key of the column the rows are sorted by. */
  declare sortKey: string | undefined;
  /** Sort order: `ascending` or `descending`. */
  declare sortDirection: SortDirection;
  /** Doesn't sort the rows: only shows the sort and fires `uf-sort`, for sorting on the server. */
  declare manualSort: boolean;
  /** Row property that identifies each row, so rows keep their DOM when the data changes. Defaults to the index. */
  declare rowKey: string | undefined;
  /** Shades every other row. */
  declare striped: boolean;
  /** Row spacing: `comfortable` or `compact`. */
  declare density: TableDensity;

  /** The table overflows its container, so it scrolls. */
  #scrollable = false;

  readonly #translator = new Translator(this);
  readonly #resizeObserver = new ResizeObserver(() => this.#checkScrollable());

  constructor() {
    super();
    this.columns = [];
    this.rows = [];
    this.sortDirection = 'ascending';
    this.manualSort = false;
    this.striped = false;
    this.density = 'comfortable';
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#resizeObserver.disconnect();
  }

  override firstUpdated(): void {
    const base = this.renderRoot.querySelector('.base')!;
    this.#resizeObserver.observe(base);
    this.#resizeObserver.observe(this.renderRoot.querySelector('table')!);
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has('rows') || changed.has('columns')) this.#checkScrollable();
  }

  /** A scrolling table must be reachable by keyboard, to scroll it. */
  #checkScrollable(): void {
    const base = this.renderRoot.querySelector('.base');
    if (!base) return;
    const scrollable = base.scrollWidth > base.clientWidth || base.scrollHeight > base.clientHeight;
    if (scrollable === this.#scrollable) return;
    this.#scrollable = scrollable;
    this.requestUpdate();
  }

  /** The rows in display order. */
  get #sortedRows(): TableRow[] {
    const rows = Array.isArray(this.rows) ? this.rows : [];
    const column = this.columns.find((c) => c.key === this.sortKey);
    if (!column || this.manualSort) return rows;
    const compare = column.compare ?? ((a: TableRow, b: TableRow) => compareValues(a[column.key], b[column.key]));
    const sign = this.sortDirection === 'descending' ? -1 : 1;
    // Stable: equal rows keep their order.
    return [...rows].sort((a, b) => sign * compare(a, b));
  }

  #sortBy(column: TableColumn): void {
    const direction: SortDirection = this.sortKey === column.key && this.sortDirection === 'ascending' ? 'descending' : 'ascending';
    this.sortKey = column.key;
    this.sortDirection = direction;
    this.dispatchEvent(
      new CustomEvent<TableSortDetail>('uf-sort', { bubbles: true, composed: true, detail: { key: column.key, direction } }),
    );
  }

  #renderHeader(column: TableColumn) {
    const sorted = column.key === this.sortKey;
    const align = { [`align-${column.align ?? 'start'}`]: true };
    return html`<th
      scope="col"
      part="header-cell"
      class=${classMap(align)}
      style=${styleMap({ width: column.width })}
      aria-sort=${sorted && column.sortable ? this.sortDirection : nothing}
    >
      ${column.sortable
        ? html`<button class="sort" part="sort-button" type="button" @click=${() => this.#sortBy(column)}>
            ${column.label}${iconSvg(sorted && this.sortDirection === 'descending' ? icons['chevron-down'] : icons['chevron-up'])}
          </button>`
        : column.label}
    </th>`;
  }

  #renderCell(column: TableColumn, row: TableRow) {
    const value = row[column.key];
    const content = column.format ? column.format(value, row) : value;
    return html`<td part="cell" class=${classMap({ [`align-${column.align ?? 'start'}`]: true })}>
      ${content === null || content === undefined ? '' : content instanceof Node ? content : String(content)}
    </td>`;
  }

  override render() {
    const columns = Array.isArray(this.columns) ? this.columns : [];
    const rows = this.#sortedRows;
    return html`<div
      class="base"
      part="base"
      tabindex=${this.#scrollable ? '0' : nothing}
      role=${this.#scrollable ? 'region' : nothing}
      aria-label=${this.#scrollable && this.label ? this.label : nothing}
    >
      <table part="table" aria-label=${this.label ?? nothing}>
        <thead>
          <tr>
            ${columns.map((column) => this.#renderHeader(column))}
          </tr>
        </thead>
        <tbody>
          ${rows.length
            ? repeat(
                rows,
                (row, index) => (this.rowKey ? row[this.rowKey] : index),
                (row) => html`<tr part="row">${columns.map((column) => this.#renderCell(column, row))}</tr>`,
              )
            : html`<tr class="empty-row">
                <td class="empty" part="empty" colspan=${Math.max(1, columns.length)}><slot name="empty">${this.#translator.t('noData')}</slot></td>
              </tr>`}
        </tbody>
      </table>
    </div>`;
  }
}

defineElement('uf-table', UfTable);

declare global {
  interface HTMLElementTagNameMap {
    'uf-table': UfTable;
  }
}
