import type { TableColumn } from '@unframed/core';
import { UfTable } from '@unframed/react';

/** A cell: text, or DOM built with the helpers below (UfTable renders cells in its shadow root). */
export type Cell = string | number | Node | null | undefined;

/** Inline code. */
export function code(text: string): HTMLElement {
  return Object.assign(document.createElement('code'), { textContent: text });
}

/** Text with `backticks` shown as code. */
export function rich(text: string | undefined): Node {
  const span = document.createElement('span');
  for (const part of (text ?? '').split(/(`[^`]+`)/)) {
    span.append(part.startsWith('`') ? code(part.slice(1, -1)) : part);
  }
  return span;
}

/** Several pieces in one cell. */
export function cell(...parts: (string | Node)[]): Node {
  const span = document.createElement('span');
  span.append(...parts);
  return span;
}

/** An element with attributes and text, e.g. a `<uf-badge>`. */
export function element(tag: string, attributes: Record<string, string>, ...children: (string | Node)[]): HTMLElement {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
  el.append(...children);
  return el;
}

/**
 * A reference table on the docs site, drawn by `<uf-table>`. Columns are
 * `[key, header]` pairs; rows hold a cell per key.
 */
export function DocTable({ label, columns, rows }: { label: string; columns: [key: string, header: string, width?: string][]; rows: Record<string, Cell>[] }) {
  const tableColumns: TableColumn[] = columns.map(([key, header, width]) => ({
    key,
    label: header,
    width,
    format: (value) => value as Cell,
  }));
  return <UfTable className="doc-table" label={label} columns={tableColumns} rows={rows} density="compact" />;
}
