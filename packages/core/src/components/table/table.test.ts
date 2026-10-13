import { afterEach, describe, expect, it, vi } from 'vitest';
import '@unframed/tokens/tokens.css';
import { axeViolations, fixture } from '../../test-utils.js';
import './table.js';
import type { TableColumn, UfTable } from './table.js';

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'age', label: 'Age', sortable: true, align: 'end' },
];
const rows = [
  { id: 1, name: 'John', role: 'Designer', age: 85 },
  { id: 2, name: 'jane', role: 'Engineer', age: 36 },
  { id: 3, name: 'Mario', role: 'Support', age: 9 },
];

const headers = (el: UfTable) => [...el.shadowRoot!.querySelectorAll('th')].map((th) => th.textContent!.trim());
const column = (el: UfTable, index: number) =>
  [...el.shadowRoot!.querySelectorAll('tbody tr')].map((tr) => tr.children[index]?.textContent!.trim());
const sortButton = (el: UfTable, label: string) =>
  [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('th button')].find((b) => b.textContent!.trim() === label)!;

async function table(props: Partial<UfTable> = {}): Promise<UfTable> {
  const el = await fixture<UfTable>('<uf-table label="People"></uf-table>');
  Object.assign(el, { columns, rows, ...props });
  await el.updateComplete;
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('uf-table', () => {
  it('renders a native table with headers and cells', async () => {
    const el = await table();
    expect(headers(el)).toEqual(['Name', 'Role', 'Age']);
    expect(column(el, 0)).toEqual(['John', 'jane', 'Mario']);
    expect(el.shadowRoot!.querySelector('table')!.getAttribute('aria-label')).toBe('People');
    expect(el.shadowRoot!.querySelectorAll('th[scope="col"]').length).toBe(3);
  });

  it('reads columns and rows from JSON attributes', async () => {
    const el = await fixture<UfTable>(
      `<uf-table columns='[{"key":"city","label":"City"}]' rows='[{"city":"Rome"},{"city":"Oslo"}]'></uf-table>`,
    );
    expect(headers(el)).toEqual(['City']);
    expect(column(el, 0)).toEqual(['Rome', 'Oslo']);
  });

  it('sorts by a sortable column, then reverses on the second click', async () => {
    const el = await table();
    sortButton(el, 'Name').click();
    await el.updateComplete;
    expect(column(el, 0)).toEqual(['jane', 'John', 'Mario']);
    expect(el.shadowRoot!.querySelector('th[aria-sort]')!.getAttribute('aria-sort')).toBe('ascending');

    sortButton(el, 'Name').click();
    await el.updateComplete;
    expect(column(el, 0)).toEqual(['Mario', 'John', 'jane']);
    expect(el.shadowRoot!.querySelector('th[aria-sort]')!.getAttribute('aria-sort')).toBe('descending');
  });

  it('sorts numbers by value', async () => {
    const el = await table({ sortKey: 'age' });
    expect(column(el, 2)).toEqual(['9', '36', '85']);
  });

  it('fires uf-sort with the column and direction', async () => {
    const el = await table();
    const onSort = vi.fn();
    el.addEventListener('uf-sort', onSort);
    sortButton(el, 'Age').click();
    sortButton(el, 'Age').click();
    expect(onSort.mock.calls.map(([e]) => e.detail)).toEqual([
      { key: 'age', direction: 'ascending' },
      { key: 'age', direction: 'descending' },
    ]);
    await el.updateComplete;
    expect(el.getAttribute('sort-key')).toBe('age');
    expect(el.getAttribute('sort-direction')).toBe('descending');
  });

  it("doesn't reorder rows with manual-sort, but still shows the sort", async () => {
    const el = await table({ manualSort: true });
    sortButton(el, 'Name').click();
    await el.updateComplete;
    expect(column(el, 0)).toEqual(['John', 'jane', 'Mario']);
    expect(el.shadowRoot!.querySelector('th[aria-sort]')).not.toBeNull();
  });

  it('has no sort button on columns that are not sortable', async () => {
    const el = await table();
    expect(el.shadowRoot!.querySelectorAll('th')[1].querySelector('button')).toBeNull();
  });

  it('uses a custom compare function', async () => {
    const byRoleLength = { ...columns[1], sortable: true, compare: (a: Record<string, unknown>, b: Record<string, unknown>) => String(a.role).length - String(b.role).length };
    const el = await table({ columns: [columns[0], byRoleLength], sortKey: 'role' });
    expect(column(el, 1)).toEqual(['Support', 'Designer', 'Engineer']);
  });

  it('formats cells as text or DOM nodes', async () => {
    const el = await table({
      columns: [
        { key: 'name', label: 'Name', format: (value) => `<${value}>` },
        { key: 'age', label: 'Age', format: (value) => Object.assign(document.createElement('b'), { textContent: String(value) }) },
      ],
    });
    expect(column(el, 0)[0]).toBe('<John>');
    expect(el.shadowRoot!.querySelector('td b')!.textContent).toBe('85');
  });

  it('aligns cells', async () => {
    const el = await table();
    const ageCell = el.shadowRoot!.querySelector('tbody tr')!.children[2];
    expect(getComputedStyle(ageCell).textAlign).toBe('end');
  });

  it('shows the empty slot when there are no rows', async () => {
    const el = await table({ rows: [] });
    const empty = el.shadowRoot!.querySelector('[part="empty"]')!;
    expect(empty.getAttribute('colspan')).toBe('3');
    expect(empty.textContent!.trim()).toBe('No data');
  });

  it('keeps row elements by rowKey when the data changes', async () => {
    const el = await table({ rowKey: 'id' });
    const johnRow = el.shadowRoot!.querySelector('tbody tr');
    el.rows = [...rows].reverse();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('tbody tr')[2]).toBe(johnRow);
  });

  it('becomes a focusable region when it scrolls', async () => {
    const many = Array.from({ length: 40 }, (_, i) => ({ name: `Person ${i}`, role: 'Tester', age: i }));
    const el = await table({ rows: many });
    el.style.setProperty('--uf-table-max-height', '10rem');
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await el.updateComplete;
    const base = el.shadowRoot!.querySelector('.base')!;
    expect(base.getAttribute('tabindex')).toBe('0');
    expect(base.getAttribute('role')).toBe('region');
    expect(base.getAttribute('aria-label')).toBe('People');
  });

  it('has no axe violations', async () => {
    const el = await table({ sortKey: 'name', striped: true });
    el.style.setProperty('--uf-table-max-height', '6rem');
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    expect(await axeViolations()).toEqual([]);
  });
});
