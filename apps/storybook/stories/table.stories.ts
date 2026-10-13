import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { TableColumn, TableSortDetail, UfTable } from '@unframed/core';
import { spread } from '../.storybook/args';
import { invoices, type Invoice } from './data';

const euro = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' });
const statusVariant = { Paid: 'success', Pending: 'warning', Overdue: 'danger' } as const;

/** A badge for the status column: format() can return DOM nodes. */
const statusBadge = (value: unknown) =>
  Object.assign(document.createElement('uf-badge'), {
    variant: statusVariant[value as Invoice['status']],
    textContent: String(value),
  });

const invoiceColumns: TableColumn[] = [
  { key: 'id', label: 'Invoice', width: '8rem' },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true, format: statusBadge },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end', format: (value) => euro.format(value as number) },
];

const meta: Meta = {
  title: 'Components/Table',
  component: 'uf-table',
  args: {
    label: 'Team',
    // Plain JSON, so it can be edited in the Controls panel.
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'role', label: 'Role' },
      { key: 'joined', label: 'Joined', sortable: true },
      { key: 'commits', label: 'Commits', sortable: true, align: 'end' },
    ],
    rows: [
      { name: 'John Smith', role: 'Product designer', joined: '2023-02-14', commits: 412 },
      { name: 'Jane Doe', role: 'Engineer', joined: '2021-09-01', commits: 1290 },
      { name: 'Mario Rossi', role: 'Product manager', joined: '2024-06-23', commits: 87 },
      { name: 'Sara Kim', role: 'Support', joined: '2022-08-26', commits: 655 },
    ],
    striped: false,
    density: 'comfortable',
  },
  render: (a) => html`<uf-table ${spread(a)}></uf-table>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Sorted: Story = {
  name: 'Sorted by default',
  args: { 'sort-key': 'commits', 'sort-direction': 'descending' },
};

export const Formatting: Story = {
  name: 'Formatted cells',
  render: () => html`<uf-table label="Invoices" .columns=${invoiceColumns} .rows=${invoices.slice(0, 6)} row-key="id"></uf-table>
    <p class="sb-note">
      <code>format</code> turns a value into text (the amounts) or a DOM node (the status badges). Sorting still uses the raw values.
    </p>`,
};

export const StripedCompact: Story = {
  name: 'Striped and compact',
  args: { striped: true, density: 'compact' },
};

export const StickyHeader: Story = {
  name: 'Scrolling with a sticky header',
  render: () => html`<uf-table
      label="All invoices"
      .columns=${invoiceColumns}
      .rows=${invoices}
      row-key="id"
      striped
      style="--uf-table-max-height: 20rem"
    ></uf-table>
    <p class="sb-note">Set <code>--uf-table-max-height</code>: the body scrolls under the header, and the table becomes focusable so keyboard users can scroll it.</p>`,
};

export const Empty: Story = {
  name: 'No rows',
  render: () => html`<div class="sb-stack" style="max-width: 40rem">
    <uf-table label="Search results" .columns=${invoiceColumns} .rows=${[]}></uf-table>
    <uf-table label="Search results" .columns=${invoiceColumns} .rows=${[]}>
      <div slot="empty">
        <strong>No invoices match your filters.</strong>
        <div><uf-button variant="link">Clear filters</uf-button></div>
      </div>
    </uf-table>
  </div>`,
};

export const ManualSort: Story = {
  name: 'Sorting on the server (manual-sort)',
  render: () => {
    const sortOnServer = async (event: CustomEvent<TableSortDetail>) => {
      const table = event.currentTarget as UfTable;
      const { key, direction } = event.detail;
      // Stands in for a request like GET /invoices?sort=amount&order=desc
      await new Promise((r) => setTimeout(r, 300));
      const sign = direction === 'ascending' ? 1 : -1;
      table.rows = [...table.rows].sort((a, b) => sign * String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }));
      table.nextElementSibling!.textContent = `Fetched rows sorted by ${key}, ${direction}.`;
    };
    return html`<uf-table label="Invoices" .columns=${invoiceColumns} .rows=${invoices.slice(0, 8)} manual-sort row-key="id" @uf-sort=${sortOnServer}></uf-table>
      <output class="sb-note" style="display: block">Sort a column: the table waits for new rows instead of sorting them itself.</output>`;
  },
};

export const WithPagination: Story = {
  name: 'With pagination',
  render: () => {
    const pageSize = 10;
    const show = (container: Element, page: number) => {
      const table = container.querySelector('uf-table')!;
      table.rows = invoices.slice((page - 1) * pageSize, page * pageSize);
      container.querySelector('output')!.textContent = `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, invoices.length)} of ${invoices.length}`;
    };
    return html`<div class="sb-table-pages">
      <uf-table label="Invoices" .columns=${invoiceColumns} .rows=${invoices.slice(0, pageSize)} row-key="id"></uf-table>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; flex-wrap: wrap; gap: 0.5rem">
        <output class="sb-note" style="margin: 0">1–${pageSize} of ${invoices.length}</output>
        <uf-pagination
          label="Invoice pages"
          pages=${Math.ceil(invoices.length / pageSize)}
          @uf-page-change=${(e: CustomEvent<{ page: number }>) => show((e.currentTarget as Element).closest('.sb-table-pages')!, e.detail.page)}
        ></uf-pagination>
      </div>
    </div>
    <p class="sb-note">The table shows one page of rows; sorting applies to that page. Sort on the server with <code>manual-sort</code> to sort across pages.</p>`;
  },
};

export const FromAttributes: Story = {
  name: 'Plain HTML (JSON attributes)',
  render: () => html`<uf-table
    label="Cities"
    columns='[{"key":"city","label":"City","sortable":true},{"key":"population","label":"Population","sortable":true,"align":"end"}]'
    rows='[{"city":"Rome","population":2761632},{"city":"Oslo","population":709037},{"city":"Lisbon","population":545796}]'
  ></uf-table>`,
};

export const Customized: Story = {
  args: {
    striped: true,
    '--uf-table-header-bg': '#0f766e',
    '--uf-table-stripe-bg': 'rgb(15 118 110 / 0.08)',
    '--uf-table-border-color': '#0f766e',
  },
  render: (a) => html`<style>
      .sb-teal-table::part(header-cell) {
        color: #ffffff;
      }
    </style>
    <uf-table class="sb-teal-table" ${spread(a)}></uf-table>`,
};
