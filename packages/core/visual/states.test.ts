import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import '@unframed/tokens/tokens.css';
import '../src/index.js';
import type { UfTable, UfToaster } from '../src/index.js';
import { fixedToday, frame, settled, slugify, themes } from './helpers.js';

fixedToday();

const weekend = (iso: string) => [0, 6].includes(new Date(iso).getUTCDay());

interface State {
  component: string;
  title: string;
  html: string;
  /** Opens or fills what the docs example's script, or a click, would. */
  setup(root: HTMLElement): void;
}

const show = (selector: string) => (root: HTMLElement) => root.querySelector<HTMLElement & { show(): void }>(selector)!.show();

// What the docs examples don't show at first: open overlays, and content their scripts add.
// The page is the whole viewport, so panels in the top layer are in the screenshot.
const states: State[] = [
  {
    component: 'combobox',
    title: 'Open',
    html: `<uf-combobox label="Time zone" placeholder="Search time zones">
      <optgroup label="Europe"><option value="Europe/Rome">Rome</option><option value="Europe/Paris">Paris</option></optgroup>
      <optgroup label="America"><option value="America/New_York">New York</option><option value="America/Chicago" disabled>Chicago</option></optgroup>
    </uf-combobox>`,
    setup: show('uf-combobox'),
  },
  {
    component: 'multi-select',
    title: 'Open',
    html: `<uf-multi-select label="Toppings" placeholder="Pick toppings">
      <option value="cheese" selected>Cheese</option><option value="olives" selected>Olives</option>
      <option value="basil">Basil</option><option value="ham" disabled>Ham (sold out)</option>
    </uf-multi-select>`,
    setup: show('uf-multi-select'),
  },
  {
    component: 'dropdown',
    title: 'Open',
    html: `<uf-dropdown>
      <uf-button slot="trigger" variant="secondary">Actions</uf-button>
      <uf-menu label="Project actions">
        <uf-menu-item value="edit">Edit<span slot="suffix">⌘E</span></uf-menu-item>
        <uf-menu-item value="duplicate">Duplicate</uf-menu-item>
        <uf-menu-item value="archive" disabled>Archive</uf-menu-item>
        <hr />
        <uf-menu-item value="pin" type="checkbox" checked>Pinned</uf-menu-item>
      </uf-menu>
    </uf-dropdown>`,
    setup: show('uf-dropdown'),
  },
  {
    component: 'popover',
    title: 'Open',
    html: `<uf-popover>
      <uf-button slot="trigger" variant="outline">Filters</uf-button>
      <uf-checkbox checked>Open issues</uf-checkbox>
      <uf-checkbox>Closed issues</uf-checkbox>
    </uf-popover>`,
    setup: show('uf-popover'),
  },
  {
    component: 'tooltip',
    title: 'Open',
    html: `<uf-tooltip content="Saves without publishing"><uf-button variant="outline">Save draft</uf-button></uf-tooltip>`,
    setup: show('uf-tooltip'),
  },
  {
    component: 'date-picker',
    title: 'Open, with disabled dates',
    html: `<uf-date-picker label="Delivery day" hint="Weekdays only" value="2026-10-14" min="2026-10-05"></uf-date-picker>`,
    setup(root) {
      const picker = root.querySelector('uf-date-picker')!;
      picker.isDateDisabled = weekend;
      picker.show();
    },
  },
  {
    component: 'date-range-picker',
    title: 'Open, with a range',
    html: `<uf-date-range-picker label="Leave" value="2026-10-20/2026-10-28" min="2026-10-05"></uf-date-range-picker>`,
    setup(root) {
      const picker = root.querySelector('uf-date-range-picker')!;
      picker.isDateDisabled = weekend;
      picker.show();
    },
  },
  {
    component: 'dialog',
    title: 'Open',
    html: `<uf-dialog label="Delete project?">
      <p>This permanently deletes the project and its 128 issues.</p>
      <uf-button slot="footer" variant="ghost">Cancel</uf-button>
      <uf-button slot="footer" variant="danger">Delete</uf-button>
    </uf-dialog>`,
    setup: show('uf-dialog'),
  },
  {
    component: 'drawer',
    title: 'Open',
    html: `<uf-drawer label="Filters">
      <uf-checkbox-group label="Status"><uf-checkbox value="open" checked>Open</uf-checkbox><uf-checkbox value="closed">Closed</uf-checkbox></uf-checkbox-group>
      <uf-button slot="footer" variant="ghost">Cancel</uf-button>
      <uf-button slot="footer">Apply</uf-button>
    </uf-drawer>`,
    setup: show('uf-drawer'),
  },
  {
    component: 'table',
    title: 'Formatted, sorted, with pages',
    html: `<uf-table label="Invoices" row-key="id" striped></uf-table><uf-pagination label="Invoice pages" pages="3" page="1"></uf-pagination>`,
    setup(root) {
      const euro = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' });
      const table = root.querySelector<UfTable>('uf-table')!;
      table.columns = [
        { key: 'customer', label: 'Customer', sortable: true },
        { key: 'due', label: 'Due' },
        { key: 'amount', label: 'Amount', sortable: true, align: 'end', format: (value) => euro.format(value as number) },
      ];
      table.rows = ['John Smith', 'Jane Doe', 'Acme Inc.', 'Globex', 'Initech'].map((customer, i) => ({
        id: i + 1,
        customer,
        due: `2026-11-${String(3 + i * 4).padStart(2, '0')}`,
        amount: [1290, 412.5, 18400, 76, 2310][i],
      }));
      table.sortKey = 'amount';
      table.sortDirection = 'descending';
    },
  },
  {
    component: 'toast',
    title: 'Variants',
    html: `<uf-toaster></uf-toaster>`,
    setup(root) {
      const toaster = root.querySelector<UfToaster>('uf-toaster')!;
      // Kept until dismissed, so none hides before the screenshot.
      toaster.add('Your changes are saved as a draft.', { duration: 0 });
      toaster.add('Changes published.', { variant: 'success', duration: 0 });
      toaster.add('The export is taking longer than usual.', { variant: 'warning', title: 'Still exporting', duration: 0 });
      toaster.add("The project couldn't be deleted.", { variant: 'danger', closable: false, duration: 0 });
    },
  },
];

/** A few frames, for panels positioned after they open. */
const frames = async (count = 3) => {
  for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
};

for (const state of states) {
  describe(state.component, () => {
    for (const theme of themes) {
      it(`${state.title} (${theme})`, async () => {
        const el = frame(theme, state.html, 'position: fixed; inset: 0');
        await settled(el);
        state.setup(el);
        await settled(el);
        await frames();
        await expect.element(page.elementLocator(el)).toMatchScreenshot(`${state.component}--state--${slugify(state.title)}--${theme}`);
      });
    }
  });
}
