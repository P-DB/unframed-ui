import { registerIcons, toast, type TableColumn, type ToastVariant } from '@unframed/core';
import {
  UfAccordion,
  UfAccordionItem,
  UfAvatar,
  UfBadge,
  UfButton,
  UfCalendar,
  UfCard,
  UfCheckbox,
  UfCheckboxGroup,
  UfCombobox,
  UfDatePicker,
  UfDialog,
  UfDropdown,
  UfIcon,
  UfInput,
  UfMenu,
  UfMenuItem,
  UfPagination,
  UfPopover,
  UfRadio,
  UfRadioGroup,
  UfSelect,
  UfSwitch,
  UfTab,
  UfTable,
  UfTabPanel,
  UfTabs,
  UfTextarea,
  UfTooltip,
} from '@unframed/react';
import { useState, type ComponentType } from 'react';

export interface Example {
  title: string;
  description?: string;
  /** Lay the preview out as a narrow column (for form fields). */
  stack?: boolean;
  Preview: ComponentType;
  html: string;
  react: string;
  /** Defaults to the HTML with Vue component names. */
  vue?: string;
  /** Defaults to the HTML: Angular uses the same tags. */
  angular?: string;
  /** Short points shown under the example. */
  notes?: string[];
}

export interface Page {
  slug: string;
  title: string;
  /** Tags documented on the page; the first is the main one. */
  tags: string[];
  /** The `@unframed/core/<name>` import path. */
  module: string;
  examples: Example[];
}

const code = (s: string) => s.trim();

// Registered once, at startup, like an app would: used by the Icon page's "Your own icons" example.
registerIcons({
  heart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z"/></svg>',
});


// A drawn portrait for the Avatar page, inline so it needs no image file.
const portrait = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#6930c3"/><circle cx="40" cy="32" r="14" fill="#d9c8f5"/><path d="M14 80a26 26 0 0 1 52 0" fill="#d9c8f5"/></svg>',
)}`;

// Sample data for the Table and Pagination pages.
const team = [
  { name: 'John Smith', role: 'Product designer', commits: 412 },
  { name: 'Jane Doe', role: 'Engineer', commits: 1290 },
  { name: 'Mario Rossi', role: 'Product manager', commits: 87 },
  { name: 'Sara Kim', role: 'Support', commits: 655 },
];
const teamColumns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'commits', label: 'Commits', sortable: true, align: 'end' },
];
const invoices = Array.from({ length: 42 }, (_, i) => ({
  id: `INV-${1001 + i}`,
  customer: ['Acme', 'Globex', 'Initech', 'Hooli', 'Wonka', 'Stark'][(i * 5) % 6],
  status: (['Paid', 'Paid', 'Pending', 'Overdue'] as const)[(i * 3) % 4],
  amount: ((i * 137) % 900) + 100,
}));
const euro = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' });
const statusVariant = { Paid: 'success', Pending: 'warning', Overdue: 'danger' } as const;
const invoiceColumns: TableColumn[] = [
  { key: 'id', label: 'Invoice' },
  { key: 'customer', label: 'Customer', sortable: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    format: (value) =>
      Object.assign(document.createElement('uf-badge'), { variant: statusVariant[value as 'Paid'], textContent: String(value) }),
  },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end', format: (value) => euro.format(value as number) },
];

function PagedInvoices() {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  return (
    <div style={{ display: 'grid', gap: '1rem', width: '100%' }}>
      <UfTable label="Invoices" columns={invoiceColumns} rows={invoices.slice((page - 1) * pageSize, page * pageSize)} rowKey="id" />
      <UfPagination
        label="Invoice pages"
        pages={Math.ceil(invoices.length / pageSize)}
        page={page}
        onUfPageChange={(event) => setPage(event.detail.page)}
      />
    </div>
  );
}

export const pages: Page[] = [
  {
    slug: 'accordion',
    title: 'Accordion',
    tags: ['uf-accordion', 'uf-accordion-item'],
    module: 'accordion',
    examples: [
      {
        title: 'One open at a time',
        description: 'Add `multiple` to let several items stay open.',
        Preview: () => (
          <div style={{ width: '100%' }}>
            <UfAccordion>
              <UfAccordionItem summary="What is Unframed?" open>
                A library of web components that work in any framework, or none.
              </UfAccordionItem>
              <UfAccordionItem summary="Can I edit the components?">
                Yes: copy their source with the CLI and change anything.
              </UfAccordionItem>
              <UfAccordionItem summary="Is it accessible?">
                Every component follows the WAI-ARIA patterns and is tested with axe.
              </UfAccordionItem>
            </UfAccordion>
          </div>
        ),
        html: code(`
<uf-accordion>
  <uf-accordion-item summary="What is Unframed?" open>
    A library of web components that work in any framework, or none.
  </uf-accordion-item>
  <uf-accordion-item summary="Can I edit the components?">…</uf-accordion-item>
</uf-accordion>`),
        react: code(`
<UfAccordion>
  <UfAccordionItem summary="What is Unframed?" open>
    A library of web components that work in any framework, or none.
  </UfAccordionItem>
  <UfAccordionItem summary="Can I edit the components?">…</UfAccordionItem>
</UfAccordion>`),
      },
    ],
  },
  {
    slug: 'avatar',
    title: 'Avatar',
    tags: ['uf-avatar'],
    module: 'avatar',
    examples: [
      {
        title: 'Image, initials or icon',
        description: 'The image when it loads, the initials of `name` when it doesn\'t, a generic icon when there\'s neither.',
        Preview: () => (
          <>
            <UfAvatar size="lg" name="John Smith" src={portrait} />
            <UfAvatar size="lg" name="John Smith" />
            <UfAvatar size="lg" />
          </>
        ),
        html: code(`
<uf-avatar name="John Smith" src="/photos/john.jpg"></uf-avatar>
<uf-avatar name="John Smith"></uf-avatar>
<uf-avatar></uf-avatar>`),
        react: code(`
<UfAvatar name="John Smith" src="/photos/john.jpg" />
<UfAvatar name="John Smith" />
<UfAvatar />`),
      },
      {
        title: 'Sizes and shapes',
        Preview: () => (
          <>
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <UfAvatar key={size} size={size} name="John Smith" />
            ))}
            <UfAvatar size="xl" shape="square" name="Unframed" initials="U" />
          </>
        ),
        html: code(`
<uf-avatar size="sm" name="John Smith"></uf-avatar>
<uf-avatar size="xl" name="John Smith"></uf-avatar>
<uf-avatar size="xl" shape="square" name="Unframed" initials="U"></uf-avatar>`),
        react: code(`
<UfAvatar size="sm" name="John Smith" />
<UfAvatar size="xl" name="John Smith" />
<UfAvatar size="xl" shape="square" name="Unframed" initials="U" />`),
      },
      {
        title: 'Next to a name',
        Preview: () => (
          <span style={{ display: 'inline-flex', gap: '0.75rem', alignItems: 'center' }}>
            <UfAvatar name="John Smith" decorative />
            <strong>John Smith</strong>
          </span>
        ),
        html: code(`
<uf-avatar name="John Smith" decorative></uf-avatar>
<strong>John Smith</strong>`),
        react: code(`
<UfAvatar name="John Smith" decorative />
<strong>John Smith</strong>`),
        notes: ['`name` is the accessible name. When the name is written next to the avatar, add `decorative` so screen readers don\'t read it twice.'],
      },
    ],
  },
  {
    slug: 'badge',
    title: 'Badge',
    tags: ['uf-badge'],
    module: 'badge',
    examples: [
      {
        title: 'Variants',
        description: 'Six colors by meaning, in three appearances: `soft` (the default), `solid` and `outline`.',
        Preview: () => (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {(['soft', 'solid', 'outline'] as const).map((appearance) => (
              <div key={appearance} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(['neutral', 'accent', 'info', 'success', 'warning', 'danger'] as const).map((variant) => (
                  <UfBadge key={variant} variant={variant} appearance={appearance}>
                    {variant}
                  </UfBadge>
                ))}
              </div>
            ))}
          </div>
        ),
        html: code(`
<uf-badge>Draft</uf-badge>
<uf-badge variant="success">Paid</uf-badge>
<uf-badge variant="warning" appearance="solid">Expiring</uf-badge>
<uf-badge variant="info" appearance="outline">Beta</uf-badge>`),
        react: code(`
<UfBadge>Draft</UfBadge>
<UfBadge variant="success">Paid</UfBadge>
<UfBadge variant="warning" appearance="solid">Expiring</UfBadge>
<UfBadge variant="info" appearance="outline">Beta</UfBadge>`),
      },
      {
        title: 'Dot, icon and size',
        Preview: () => (
          <>
            <UfBadge dot variant="success">
              Online
            </UfBadge>
            <UfBadge variant="success">
              <UfIcon slot="prefix" name="check-circle" />
              Verified
            </UfBadge>
            <UfBadge size="sm" variant="accent">
              New
            </UfBadge>
          </>
        ),
        html: code(`
<uf-badge dot variant="success">Online</uf-badge>
<uf-badge variant="success"><uf-icon slot="prefix" name="check-circle"></uf-icon>Verified</uf-badge>
<uf-badge size="sm" variant="accent">New</uf-badge>`),
        react: code(`
<UfBadge dot variant="success">Online</UfBadge>
<UfBadge variant="success"><UfIcon slot="prefix" name="check-circle" />Verified</UfBadge>
<UfBadge size="sm" variant="accent">New</UfBadge>`),
        notes: ['Badges are read as plain text: write "3 unread" rather than "3", so the badge makes sense on its own.'],
      },
    ],
  },
  {
    slug: 'button',
    title: 'Button',
    tags: ['uf-button'],
    module: 'button',
    examples: [
      {
        title: 'Variants',
        Preview: () => (
          <>
            <UfButton>Primary</UfButton>
            <UfButton variant="secondary">Secondary</UfButton>
            <UfButton variant="outline">Outline</UfButton>
            <UfButton variant="ghost">Ghost</UfButton>
            <UfButton variant="danger">Danger</UfButton>
            <UfButton variant="link">Link</UfButton>
          </>
        ),
        html: code(`
<uf-button>Primary</uf-button>
<uf-button variant="secondary">Secondary</uf-button>
<uf-button variant="outline">Outline</uf-button>
<uf-button variant="ghost">Ghost</uf-button>
<uf-button variant="danger">Danger</uf-button>
<uf-button variant="link">Link</uf-button>`),
        react: code(`
<UfButton>Primary</UfButton>
<UfButton variant="secondary">Secondary</UfButton>
<UfButton variant="outline">Outline</UfButton>
<UfButton variant="ghost">Ghost</UfButton>
<UfButton variant="danger">Danger</UfButton>
<UfButton variant="link">Link</UfButton>`),
      },
      {
        title: 'Icons, sizes and states',
        description: 'Icon-only buttons need a `label` for screen readers.',
        Preview: () => (
          <>
            <UfButton size="sm">
              <UfIcon slot="prefix" name="plus" />
              New
            </UfButton>
            <UfButton size="lg" variant="secondary">
              Next
              <UfIcon slot="suffix" name="chevron-right" />
            </UfButton>
            <UfButton variant="ghost" label="Search">
              <UfIcon slot="prefix" name="search" />
            </UfButton>
            <UfButton loading>Saving</UfButton>
            <UfButton disabled>Disabled</UfButton>
          </>
        ),
        html: code(`
<uf-button size="sm"><uf-icon slot="prefix" name="plus"></uf-icon>New</uf-button>
<uf-button size="lg" variant="secondary">Next<uf-icon slot="suffix" name="chevron-right"></uf-icon></uf-button>
<uf-button variant="ghost" label="Search"><uf-icon slot="prefix" name="search"></uf-icon></uf-button>
<uf-button loading>Saving</uf-button>
<uf-button disabled>Disabled</uf-button>`),
        react: code(`
<UfButton size="sm"><UfIcon slot="prefix" name="plus" />New</UfButton>
<UfButton size="lg" variant="secondary">Next<UfIcon slot="suffix" name="chevron-right" /></UfButton>
<UfButton variant="ghost" label="Search"><UfIcon slot="prefix" name="search" /></UfButton>
<UfButton loading>Saving</UfButton>
<UfButton disabled>Disabled</UfButton>`),
      },
    ],
  },
  {
    slug: 'card',
    title: 'Card',
    tags: ['uf-card'],
    module: 'card',
    examples: [
      {
        title: 'Media, header, content and footer',
        description: 'Every section is optional; empty ones take no space.',
        Preview: () => (
          <UfCard style={{ maxWidth: '22rem' }}>
            <img slot="media" src={`${import.meta.env.BASE_URL}og-image.png`} alt="The Unframed logo" style={{ aspectRatio: '1200 / 630' }} />
            <div slot="header">
              <h4 style={{ margin: 0 }}>Unframed 0.2</h4>
              <small>Released this week</small>
            </div>
            A link button variant, new colors and smaller Angular bundles.
            <UfButton slot="footer">Read more</UfButton>
            <UfButton slot="footer" variant="ghost">
              Dismiss
            </UfButton>
          </UfCard>
        ),
        html: code(`
<uf-card>
  <img slot="media" src="/cover.png" alt="The Unframed logo" />
  <div slot="header">
    <h3>Unframed 0.2</h3>
    <small>Released this week</small>
  </div>
  A link button variant, new colors and smaller Angular bundles.
  <uf-button slot="footer">Read more</uf-button>
  <uf-button slot="footer" variant="ghost">Dismiss</uf-button>
</uf-card>`),
        react: code(`
<UfCard>
  <img slot="media" src="/cover.png" alt="The Unframed logo" />
  <div slot="header">
    <h3>Unframed 0.2</h3>
    <small>Released this week</small>
  </div>
  A link button variant, new colors and smaller Angular bundles.
  <UfButton slot="footer">Read more</UfButton>
  <UfButton slot="footer" variant="ghost">Dismiss</UfButton>
</UfCard>`),
      },
      {
        title: 'Variants and orientation',
        Preview: () => (
          <>
            {(['outline', 'elevated', 'filled'] as const).map((variant) => (
              <UfCard key={variant} variant={variant} style={{ width: '10rem' }}>
                <strong slot="header">{variant}</strong>A card.
              </UfCard>
            ))}
          </>
        ),
        html: code(`
<uf-card variant="elevated">…</uf-card>
<uf-card variant="filled">…</uf-card>
<uf-card orientation="horizontal">
  <img slot="media" src="/cover.png" alt="" />
  Media beside the content.
</uf-card>`),
        react: code(`
<UfCard variant="elevated">…</UfCard>
<UfCard variant="filled">…</UfCard>
<UfCard orientation="horizontal">
  <img slot="media" src="/cover.png" alt="" />
  Media beside the content.
</UfCard>`),
      },
    ],
  },
  {
    slug: 'checkbox',
    title: 'Checkbox',
    tags: ['uf-checkbox', 'uf-checkbox-group'],
    module: 'checkbox',
    examples: [
      {
        title: 'States',
        stack: true,
        Preview: () => (
          <>
            <UfCheckbox checked hint="One email a month.">
              Subscribe to the newsletter
            </UfCheckbox>
            <UfCheckbox indeterminate>Select all</UfCheckbox>
            <UfCheckbox disabled>Disabled</UfCheckbox>
          </>
        ),
        html: code(`
<uf-checkbox checked hint="One email a month.">Subscribe to the newsletter</uf-checkbox>
<uf-checkbox indeterminate>Select all</uf-checkbox>
<uf-checkbox disabled>Disabled</uf-checkbox>`),
        react: code(`
<UfCheckbox checked hint="One email a month.">Subscribe to the newsletter</UfCheckbox>
<UfCheckbox indeterminate>Select all</UfCheckbox>
<UfCheckbox disabled>Disabled</UfCheckbox>`),
      },
      {
        title: 'Select all',
        description:
          'Inside `<uf-checkbox-group>`, a checkbox with `select-all` checks or unchecks the others, and turns indeterminate when only some are checked. The group\'s `value` lists the checked values.',
        stack: true,
        Preview: () => {
          const [toppings, setToppings] = useState<string[]>(['olives']);
          return (
            <>
              <UfCheckboxGroup
                label="Toppings"
                value={toppings}
                onChange={(e) => setToppings([...(e.currentTarget as HTMLElement & { value: string[] }).value])}
              >
                <UfCheckbox selectAll>All toppings</UfCheckbox>
                <UfCheckbox name="topping" value="cheese">Cheese</UfCheckbox>
                <UfCheckbox name="topping" value="olives">Olives</UfCheckbox>
                <UfCheckbox name="topping" value="basil">Basil</UfCheckbox>
              </UfCheckboxGroup>
              <span style={{ color: 'var(--uf-color-text-muted)', fontSize: '0.875rem' }}>
                Selected: {toppings.length ? toppings.join(', ') : 'none'}
              </span>
            </>
          );
        },
        html: code(`
<uf-checkbox-group label="Toppings">
  <uf-checkbox select-all>All toppings</uf-checkbox>
  <uf-checkbox name="topping" value="cheese">Cheese</uf-checkbox>
  <uf-checkbox name="topping" value="olives" checked>Olives</uf-checkbox>
  <uf-checkbox name="topping" value="basil">Basil</uf-checkbox>
</uf-checkbox-group>`),
        react: code(`
const [toppings, setToppings] = useState(['olives']);

<UfCheckboxGroup label="Toppings" value={toppings} onChange={(e) => setToppings([...e.currentTarget.value])}>
  <UfCheckbox selectAll>All toppings</UfCheckbox>
  <UfCheckbox value="cheese">Cheese</UfCheckbox>
  <UfCheckbox value="olives">Olives</UfCheckbox>
  <UfCheckbox value="basil">Basil</UfCheckbox>
</UfCheckboxGroup>`),
        vue: code(`
<script setup>
const toppings = ref(['olives']);
</script>

<template>
  <UfCheckboxGroup v-model="toppings" label="Toppings">
    <UfCheckbox select-all>All toppings</UfCheckbox>
    <UfCheckbox value="cheese">Cheese</UfCheckbox>
    <UfCheckbox value="olives">Olives</UfCheckbox>
    <UfCheckbox value="basil">Basil</UfCheckbox>
  </UfCheckboxGroup>
</template>`),
        angular: code(`
<!-- toppings = new FormControl<string[]>(['olives']) -->
<uf-checkbox-group [formControl]="toppings" label="Toppings">
  <uf-checkbox select-all>All toppings</uf-checkbox>
  <uf-checkbox value="cheese">Cheese</uf-checkbox>
  <uf-checkbox value="olives">Olives</uf-checkbox>
  <uf-checkbox value="basil">Basil</uf-checkbox>
</uf-checkbox-group>`),
      },
      {
        title: 'Binding the indeterminate state',
        description:
          'A click clears `indeterminate`. To keep your own state in sync, use `v-model:indeterminate` in Vue, `[(indeterminate)]` in Angular, or read it in `onChange` in React.',
        stack: true,
        Preview: () => {
          const [checked, setChecked] = useState(false);
          const [some, setSome] = useState(true);
          return (
            <>
              <UfCheckbox
                checked={checked}
                indeterminate={some}
                onChange={(e) => {
                  const box = e.currentTarget as HTMLElement & { checked: boolean; indeterminate: boolean };
                  setChecked(box.checked);
                  setSome(box.indeterminate);
                }}
              >
                Notify me
              </UfCheckbox>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <UfButton size="sm" variant="secondary" onClick={() => setSome(true)}>
                  Make indeterminate
                </UfButton>
              </div>
            </>
          );
        },
        html: code(`<uf-checkbox indeterminate>Notify me</uf-checkbox>`),
        react: code(`
const [checked, setChecked] = useState(false);
const [some, setSome] = useState(true);

<UfCheckbox
  checked={checked}
  indeterminate={some}
  onChange={(e) => {
    setChecked(e.currentTarget.checked);
    setSome(e.currentTarget.indeterminate);
  }}
>
  Notify me
</UfCheckbox>`),
        vue: code(`<UfCheckbox v-model="checked" v-model:indeterminate="some">Notify me</UfCheckbox>`),
        angular: code(`<uf-checkbox [(ngModel)]="checked" [(indeterminate)]="some">Notify me</uf-checkbox>`),
      },
    ],
  },
  {
    slug: 'combobox',
    title: 'Combobox',
    tags: ['uf-combobox'],
    module: 'combobox',
    examples: [
      {
        title: 'Searchable list',
        description: 'Type to filter, arrow keys to move, Enter to pick.',
        stack: true,
        Preview: () => (
          <UfCombobox label="Time zone" placeholder="Search time zones">
            <optgroup label="Europe">
              <option value="Europe/Rome">Rome</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Europe/London">London</option>
            </optgroup>
            <optgroup label="Americas">
              <option value="America/New_York">New York</option>
              <option value="America/Los_Angeles">Los Angeles</option>
            </optgroup>
            <optgroup label="Asia">
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Asia/Singapore">Singapore</option>
            </optgroup>
          </UfCombobox>
        ),
        html: code(`
<uf-combobox label="Time zone" placeholder="Search time zones">
  <optgroup label="Europe">
    <option value="Europe/Rome">Rome</option>
    <option value="Europe/Paris">Paris</option>
  </optgroup>
  <!-- … -->
</uf-combobox>`),
        react: code(`
<UfCombobox label="Time zone" placeholder="Search time zones" onChange={(e) => setZone(e.target.value)}>
  <optgroup label="Europe">
    <option value="Europe/Rome">Rome</option>
    <option value="Europe/Paris">Paris</option>
  </optgroup>
  {/* … */}
</UfCombobox>`),
        vue: code(`
<UfCombobox v-model="zone" label="Time zone" placeholder="Search time zones">
  <optgroup label="Europe">
    <option value="Europe/Rome">Rome</option>
    <option value="Europe/Paris">Paris</option>
  </optgroup>
</UfCombobox>`),
        angular: code(`
<uf-combobox [formControl]="zone" label="Time zone" placeholder="Search time zones">
  <optgroup label="Europe">
    <option value="Europe/Rome">Rome</option>
    <option value="Europe/Paris">Paris</option>
  </optgroup>
</uf-combobox>`),
      },
    ],
  },
  {
    slug: 'date-picker',
    title: 'Date picker',
    tags: ['uf-date-picker', 'uf-calendar'],
    module: 'date-picker',
    examples: [
      {
        title: 'Type or pick a date',
        description: 'Type a date in the page language\'s format, or open the calendar. The value is always `YYYY-MM-DD`.',
        stack: true,
        Preview: () => {
          const [value, setValue] = useState('');
          return (
            <>
              <UfDatePicker
                label="Check-in"
                hint="From 3 pm"
                name="checkin"
                min={new Date().toISOString().slice(0, 10)}
                required
                onChange={(event) => setValue((event.target as HTMLInputElement).value)}
              />
              <small>value: {value ? <code>{value}</code> : 'empty'}</small>
            </>
          );
        },
        html: code(`
<uf-date-picker label="Check-in" hint="From 3 pm" name="checkin" min="2026-10-14" required></uf-date-picker>`),
        react: code(`
const [checkin, setCheckin] = useState('');

<UfDatePicker
  label="Check-in"
  hint="From 3 pm"
  min="2026-10-14"
  required
  value={checkin}
  onChange={(event) => setCheckin((event.target as UfDatePickerElement).value)}
/>`),
        vue: code(`
<UfDatePicker v-model="checkin" label="Check-in" hint="From 3 pm" min="2026-10-14" required />`),
        angular: code(`
<uf-date-picker [(ngModel)]="checkin" label="Check-in" hint="From 3 pm" min="2026-10-14" required />`),
        notes: [
          'Arrow keys move by day and week, Page Up and Page Down by month (with Shift, by year). Alt + Down Arrow opens the calendar, Escape closes it.',
          'The format, month names and first day of the week follow the nearest `lang` attribute: `14/10/2026` in Italian, `10/14/2026` in US English.',
          'Typed text that isn\'t a date stays in the field with an error, so the user can fix it.',
        ],
      },
      {
        title: 'Disabled dates',
        description: '`min` and `max` limit the range; `isDateDisabled` rules out single dates, like weekends.',
        stack: true,
        Preview: () => (
          <UfDatePicker
            label="Delivery day"
            hint="Weekdays only"
            isDateDisabled={(date) => [0, 6].includes(new Date(date).getUTCDay())}
          />
        ),
        html: code(`
<uf-date-picker id="delivery" label="Delivery day" hint="Weekdays only"></uf-date-picker>

<script type="module">
  // A property, not an attribute: it's a function.
  document.querySelector('#delivery').isDateDisabled = (date) =>
    [0, 6].includes(new Date(date).getUTCDay());
</script>`),
        react: code(`
<UfDatePicker
  label="Delivery day"
  hint="Weekdays only"
  isDateDisabled={(date) => [0, 6].includes(new Date(date).getUTCDay())}
/>`),
      },
      {
        title: 'Calendar on its own',
        description: '`<uf-calendar>` is the grid inside the picker. Use it inline, e.g. on a booking page.',
        Preview: () => {
          const [value, setValue] = useState('');
          return (
            <div style={{ display: 'grid', gap: '0.5rem', justifyItems: 'start' }}>
              <UfCalendar value={value} onChange={(event) => setValue((event.target as HTMLElement & { value: string }).value)} />
              <small>value: {value ? <code>{value}</code> : 'empty'}</small>
            </div>
          );
        },
        html: code(`
<uf-calendar value="2026-10-14"></uf-calendar>

<script type="module">
  document.querySelector('uf-calendar').addEventListener('change', (event) => {
    console.log(event.target.value); // "2026-10-21"
  });
</script>`),
        react: code(`
<UfCalendar value={day} onChange={(event) => setDay((event.target as UfCalendarElement).value)} />`),
      },
    ],
  },
  {
    slug: 'dialog',
    title: 'Dialog',
    tags: ['uf-dialog'],
    module: 'dialog',
    examples: [
      {
        title: 'Confirmation',
        description: 'Escape, the close button and any element with `data-dialog="close"` close it.',
        Preview: () => {
          const [open, setOpen] = useState(false);
          return (
            <>
              <UfButton variant="danger" onClick={() => setOpen(true)}>
                Delete project…
              </UfButton>
              <UfDialog label="Delete project?" open={open} lightDismiss onUfHide={() => setOpen(false)}>
                <p style={{ margin: 0 }}>This permanently deletes the project and its 128 issues.</p>
                <UfButton slot="footer" variant="ghost" data-dialog="close">
                  Cancel
                </UfButton>
                <UfButton
                  slot="footer"
                  variant="danger"
                  onClick={() => {
                    setOpen(false);
                    toast('Project deleted', { variant: 'danger' });
                  }}
                >
                  Delete
                </UfButton>
              </UfDialog>
            </>
          );
        },
        html: code(`
<uf-button variant="danger" onclick="this.nextElementSibling.show()">Delete project…</uf-button>
<uf-dialog label="Delete project?" light-dismiss>
  <p>This permanently deletes the project and its 128 issues.</p>
  <uf-button slot="footer" variant="ghost" data-dialog="close">Cancel</uf-button>
  <uf-button slot="footer" variant="danger">Delete</uf-button>
</uf-dialog>`),
        react: code(`
const [open, setOpen] = useState(false);

<UfButton variant="danger" onClick={() => setOpen(true)}>Delete project…</UfButton>
<UfDialog label="Delete project?" open={open} lightDismiss onUfHide={() => setOpen(false)}>
  <p>This permanently deletes the project and its 128 issues.</p>
  <UfButton slot="footer" variant="ghost" data-dialog="close">Cancel</UfButton>
  <UfButton slot="footer" variant="danger" onClick={remove}>Delete</UfButton>
</UfDialog>`),
        vue: code(`
<script setup>
const dialog = ref();
</script>

<template>
  <UfButton variant="danger" @click="dialog.el.show()">Delete project…</UfButton>
  <UfDialog ref="dialog" label="Delete project?" light-dismiss>
    <p>This permanently deletes the project and its 128 issues.</p>
    <UfButton slot="footer" variant="ghost" data-dialog="close">Cancel</UfButton>
    <UfButton slot="footer" variant="danger" @click="remove">Delete</UfButton>
  </UfDialog>
</template>`),
        angular: code(`
<uf-button variant="danger" (click)="dialog.el.show()">Delete project…</uf-button>
<uf-dialog #dialog label="Delete project?" light-dismiss>
  <p>This permanently deletes the project and its 128 issues.</p>
  <uf-button slot="footer" variant="ghost" data-dialog="close">Cancel</uf-button>
  <uf-button slot="footer" variant="danger" (click)="remove()">Delete</uf-button>
</uf-dialog>`),
      },
    ],
  },
  {
    slug: 'dropdown',
    title: 'Dropdown menu',
    tags: ['uf-dropdown', 'uf-menu', 'uf-menu-item'],
    module: 'dropdown',
    examples: [
      {
        title: 'Menu button',
        description: 'Arrow keys move, typing a letter jumps to an item, Escape closes.',
        Preview: () => (
          <UfDropdown onUfSelect={(e) => toast(`Chose "${e.detail.value}"`)}>
            <UfButton slot="trigger" variant="secondary">
              Actions
              <UfIcon slot="suffix" name="chevron-down" />
            </UfButton>
            <UfMenu label="Project actions">
              <UfMenuItem value="edit">
                Edit<span slot="suffix">⌘E</span>
              </UfMenuItem>
              <UfMenuItem value="duplicate">
                Duplicate<span slot="suffix">⌘D</span>
              </UfMenuItem>
              <hr />
              <UfMenuItem value="pin" type="checkbox" checked>
                Pinned
              </UfMenuItem>
              <hr />
              <UfMenuItem value="delete">Delete</UfMenuItem>
            </UfMenu>
          </UfDropdown>
        ),
        html: code(`
<uf-dropdown>
  <uf-button slot="trigger" variant="secondary">Actions</uf-button>
  <uf-menu label="Project actions">
    <uf-menu-item value="edit">Edit<span slot="suffix">⌘E</span></uf-menu-item>
    <uf-menu-item value="duplicate">Duplicate</uf-menu-item>
    <hr />
    <uf-menu-item value="pin" type="checkbox" checked>Pinned</uf-menu-item>
  </uf-menu>
</uf-dropdown>`),
        react: code(`
<UfDropdown onUfSelect={(e) => run(e.detail.value)}>
  <UfButton slot="trigger" variant="secondary">Actions</UfButton>
  <UfMenu label="Project actions">
    <UfMenuItem value="edit">Edit<span slot="suffix">⌘E</span></UfMenuItem>
    <UfMenuItem value="duplicate">Duplicate</UfMenuItem>
    <hr />
    <UfMenuItem value="pin" type="checkbox" checked>Pinned</UfMenuItem>
  </UfMenu>
</UfDropdown>`),
        vue: code(`
<UfDropdown @uf-select="(e) => run(e.detail.value)">
  <UfButton slot="trigger" variant="secondary">Actions</UfButton>
  <UfMenu label="Project actions">
    <UfMenuItem value="edit">Edit<span slot="suffix">⌘E</span></UfMenuItem>
    <UfMenuItem value="duplicate">Duplicate</UfMenuItem>
    <hr />
    <UfMenuItem value="pin" type="checkbox" checked>Pinned</UfMenuItem>
  </UfMenu>
</UfDropdown>`),
        angular: code(`
<uf-dropdown (uf-select)="run($event.detail.value)">
  <uf-button slot="trigger" variant="secondary">Actions</uf-button>
  <uf-menu label="Project actions">
    <uf-menu-item value="edit">Edit<span slot="suffix">⌘E</span></uf-menu-item>
    <uf-menu-item value="duplicate">Duplicate</uf-menu-item>
    <hr />
    <uf-menu-item value="pin" type="checkbox" checked>Pinned</uf-menu-item>
  </uf-menu>
</uf-dropdown>`),
      },
    ],
  },
  {
    slug: 'icon',
    title: 'Icon',
    tags: ['uf-icon'],
    module: 'icon',
    examples: [
      {
        title: 'Built-in set',
        description: 'Icons are decorative unless you give them a `label`. Add your own with `registerIcons()`.',
        Preview: () => (
          <>
            {['check', 'x', 'plus', 'search', 'info', 'check-circle', 'alert-triangle', 'alert-circle', 'chevron-down', 'sun', 'moon'].map(
              (name) => (
                <UfIcon key={name} name={name} style={{ '--uf-icon-size': '1.5rem' } as React.CSSProperties} />
              ),
            )}
          </>
        ),
        html: code(`<uf-icon name="check-circle" label="Done"></uf-icon>`),
        react: code(`<UfIcon name="check-circle" label="Done" />`),
      },
      {
        title: 'Your own icons',
        description:
          'Call `registerIcons()` once, at startup, with SVG markup keyed by name. Then use the name like a built-in icon.',
        Preview: () => (
          <>
            <UfIcon name="heart" label="Favorite" style={{ '--uf-icon-size': '1.5rem', color: 'var(--uf-color-danger-text)' } as React.CSSProperties} />
            <UfIcon name="star" label="Starred" style={{ '--uf-icon-size': '1.5rem', color: 'var(--uf-color-warning)' } as React.CSSProperties} />
            <UfButton variant="secondary">
              <UfIcon slot="prefix" name="heart" />
              Save
            </UfButton>
          </>
        ),
        html: code(`
<script type="module">
  import { registerIcons } from '@unframed/core/icon';

  registerIcons({
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">…</svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor">…</svg>',
  });
</script>

<uf-icon name="heart" label="Favorite"></uf-icon>
<uf-button><uf-icon slot="prefix" name="heart"></uf-icon>Save</uf-button>`),
        react: code(`
// main.tsx, once at startup
import { registerIcons } from '@unframed/core/icon';
import heart from './icons/heart.svg?raw'; // Vite: import the file as a string

registerIcons({ heart });

// anywhere
<UfIcon name="heart" label="Favorite" />
<UfButton><UfIcon slot="prefix" name="heart" />Save</UfButton>`),
        vue: code(`
// main.ts, once at startup
import { registerIcons } from '@unframed/core/icon';
import heart from './icons/heart.svg?raw';

registerIcons({ heart });

<!-- any template -->
<UfIcon name="heart" label="Favorite" />`),
        angular: code(`
// main.ts, before bootstrapApplication()
import { registerIcons } from '@unframed/core/icon';

registerIcons({
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">…</svg>',
});

<!-- any template -->
<uf-icon name="heart" label="Favorite" />`),
        notes: [
          'Use `currentColor` for strokes and fills, so the icon takes the text color around it (set `color` to change it).',
          'Keep a `viewBox` and leave out `width`/`height`: the icon is `1em` square, so it follows the font size. Change it with `--uf-icon-size`.',
          'Registering a built-in name (e.g. `x`) replaces that icon everywhere, including inside components like the dialog\'s close button.',
          'Icons already on the page update when you register their name, so registration order doesn\'t matter.',
          'The markup is inserted as-is: only register SVG from your own code or files, never from user input.',
        ],
      },
    ],
  },
  {
    slug: 'input',
    title: 'Input',
    tags: ['uf-input'],
    module: 'input',
    examples: [
      {
        title: 'With label, hint and validation',
        description: 'Errors appear after the user edits the field or tries to submit.',
        stack: true,
        Preview: () => (
          <form style={{ display: 'grid', gap: '1rem' }} noValidate onSubmit={(e) => {
            e.preventDefault();
            const fields = [...e.currentTarget.querySelectorAll<HTMLElement & { reportValidity(): boolean }>('uf-input')];
            if (fields.map((f) => f.reportValidity()).every(Boolean)) toast('Subscribed', { variant: 'success' });
          }}>
            <UfInput name="email" type="email" label="Email" hint="We never share it." required>
              <UfIcon slot="prefix" name="info" />
            </UfInput>
            <div>
              <UfButton type="submit">Subscribe</UfButton>
            </div>
          </form>
        ),
        html: code(`
<form>
  <uf-input name="email" type="email" label="Email" hint="We never share it." required>
    <uf-icon slot="prefix" name="info"></uf-icon>
  </uf-input>
  <uf-button type="submit">Subscribe</uf-button>
</form>`),
        react: code(`
<form onSubmit={subscribe}>
  <UfInput name="email" type="email" label="Email" hint="We never share it." required>
    <UfIcon slot="prefix" name="info" />
  </UfInput>
  <UfButton type="submit">Subscribe</UfButton>
</form>`),
        vue: code(`
<script setup>
const email = ref('');
</script>

<template>
  <form @submit.prevent="subscribe">
    <UfInput v-model="email" name="email" type="email" label="Email" hint="We never share it." required>
      <UfIcon slot="prefix" name="info" />
    </UfInput>
    <UfButton type="submit">Subscribe</UfButton>
  </form>
</template>`),
        angular: code(`
<form (ngSubmit)="subscribe()">
  <uf-input [(ngModel)]="email" name="email" type="email" label="Email" hint="We never share it." required>
    <uf-icon slot="prefix" name="info" />
  </uf-input>
  <uf-button type="submit">Subscribe</uf-button>
</form>`),
      },
    ],
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    tags: ['uf-pagination'],
    module: 'pagination',
    examples: [
      {
        title: 'Pages',
        description: 'Long ranges collapse around the current page; the number of buttons stays the same from page to page.',
        Preview: () => {
          const [page, setPage] = useState(6);
          return <UfPagination pages={20} page={page} onUfPageChange={(event) => setPage(event.detail.page)} />;
        },
        html: code(`
<uf-pagination pages="20" page="6"></uf-pagination>

<script type="module">
  document.querySelector('uf-pagination').addEventListener('uf-page-change', (event) => {
    loadPage(event.detail.page);
  });
</script>`),
        react: code(`
const [page, setPage] = useState(6);

<UfPagination pages={20} page={page} onUfPageChange={(event) => setPage(event.detail.page)} />`),
        vue: code(`
<UfPagination :pages="20" :page="page" @uf-page-change="page = $event.detail.page" />`),
        angular: code(`
<uf-pagination [pages]="20" [page]="page()" (uf-page-change)="page.set($event.detail.page)" />`),
      },
      {
        title: 'Siblings and size',
        Preview: () => (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <UfPagination label="Two siblings" pages={30} page={15} siblings={2} />
            <UfPagination label="Small" pages={30} page={15} size="sm" />
          </div>
        ),
        html: code(`
<uf-pagination pages="30" page="15" siblings="2"></uf-pagination>
<uf-pagination pages="30" page="15" size="sm"></uf-pagination>`),
        react: code(`
<UfPagination pages={30} page={15} siblings={2} />
<UfPagination pages={30} page={15} size="sm" />`),
        notes: ['Each pagination is a navigation landmark: when a page has more than one, give each a different `label`.'],
      },
    ],
  },
  {
    slug: 'popover',
    title: 'Popover',
    tags: ['uf-popover'],
    module: 'popover',
    examples: [
      {
        title: 'Floating panel',
        Preview: () => (
          <UfPopover>
            <UfButton slot="trigger" variant="outline">
              Filters
              <UfIcon slot="suffix" name="chevron-down" />
            </UfButton>
            <div style={{ display: 'grid', gap: '0.5rem', width: '14rem' }}>
              <UfCheckbox checked>Open issues</UfCheckbox>
              <UfCheckbox>Closed issues</UfCheckbox>
              <UfSwitch>Only mine</UfSwitch>
            </div>
          </UfPopover>
        ),
        html: code(`
<uf-popover>
  <uf-button slot="trigger" variant="outline">Filters</uf-button>
  <uf-checkbox checked>Open issues</uf-checkbox>
  <uf-checkbox>Closed issues</uf-checkbox>
</uf-popover>`),
        react: code(`
<UfPopover>
  <UfButton slot="trigger" variant="outline">Filters</UfButton>
  <UfCheckbox checked>Open issues</UfCheckbox>
  <UfCheckbox>Closed issues</UfCheckbox>
</UfPopover>`),
      },
    ],
  },
  {
    slug: 'radio-group',
    title: 'Radio group',
    tags: ['uf-radio-group', 'uf-radio'],
    module: 'radio-group',
    examples: [
      {
        title: 'Pick one',
        description: 'Arrow keys move the selection; only the selected radio is in the tab order.',
        Preview: () => (
          <UfRadioGroup label="Plan" value="pro" orientation="horizontal">
            <UfRadio value="free">Free</UfRadio>
            <UfRadio value="pro">Pro</UfRadio>
            <UfRadio value="team">Team</UfRadio>
            <UfRadio value="enterprise" disabled>
              Enterprise
            </UfRadio>
          </UfRadioGroup>
        ),
        html: code(`
<uf-radio-group label="Plan" value="pro" orientation="horizontal">
  <uf-radio value="free">Free</uf-radio>
  <uf-radio value="pro">Pro</uf-radio>
  <uf-radio value="team">Team</uf-radio>
  <uf-radio value="enterprise" disabled>Enterprise</uf-radio>
</uf-radio-group>`),
        react: code(`
<UfRadioGroup label="Plan" value="pro" orientation="horizontal">
  <UfRadio value="free">Free</UfRadio>
  <UfRadio value="pro">Pro</UfRadio>
  <UfRadio value="team">Team</UfRadio>
  <UfRadio value="enterprise" disabled>Enterprise</UfRadio>
</UfRadioGroup>`),
      },
    ],
  },
  {
    slug: 'select',
    title: 'Select',
    tags: ['uf-select'],
    module: 'select',
    examples: [
      {
        title: 'Native options',
        description: 'Built on the native `<select>`: write plain `<option>` and `<optgroup>` children.',
        stack: true,
        Preview: () => (
          <UfSelect label="Country" placeholder="Choose a country">
            <option value="it">Italy</option>
            <option value="fr">France</option>
            <optgroup label="Elsewhere">
              <option value="jp">Japan</option>
              <option value="us">United States</option>
            </optgroup>
          </UfSelect>
        ),
        html: code(`
<uf-select label="Country" placeholder="Choose a country">
  <option value="it">Italy</option>
  <option value="fr">France</option>
  <optgroup label="Elsewhere">
    <option value="jp">Japan</option>
    <option value="us">United States</option>
  </optgroup>
</uf-select>`),
        react: code(`
<UfSelect label="Country" placeholder="Choose a country">
  <option value="it">Italy</option>
  <option value="fr">France</option>
  <optgroup label="Elsewhere">
    <option value="jp">Japan</option>
    <option value="us">United States</option>
  </optgroup>
</UfSelect>`),
      },
    ],
  },
  {
    slug: 'switch',
    title: 'Switch',
    tags: ['uf-switch'],
    module: 'switch',
    examples: [
      {
        title: 'Settings that apply immediately',
        stack: true,
        Preview: () => {
          const [on, setOn] = useState(true);
          return (
            <UfSwitch checked={on} onChange={(e) => setOn((e.target as HTMLInputElement).checked)}>
              Notifications are {on ? 'on' : 'off'}
            </UfSwitch>
          );
        },
        html: code(`<uf-switch checked>Notifications</uf-switch>`),
        react: code(`
const [on, setOn] = useState(true);

<UfSwitch checked={on} onChange={(e) => setOn(e.target.checked)}>
  Notifications are {on ? 'on' : 'off'}
</UfSwitch>`),
        vue: code(`
<UfSwitch v-model="on">Notifications are {{ on ? 'on' : 'off' }}</UfSwitch>`),
        angular: code(`
<uf-switch [(ngModel)]="on">Notifications are {{ on ? 'on' : 'off' }}</uf-switch>`),
      },
    ],
  },
  {
    slug: 'table',
    title: 'Table',
    tags: ['uf-table'],
    module: 'table',
    examples: [
      {
        title: 'Columns, rows and sorting',
        description: 'Describe the columns and pass the rows. Columns marked `sortable` sort on click.',
        Preview: () => <UfTable label="Team" columns={teamColumns} rows={team} style={{ width: '100%' }} />,
        html: code(`
<uf-table
  label="Team"
  columns='[{"key": "name", "label": "Name", "sortable": true},
            {"key": "role", "label": "Role"},
            {"key": "commits", "label": "Commits", "sortable": true, "align": "end"}]'
  rows='[{"name": "John Smith", "role": "Product designer", "commits": 412},
         {"name": "Jane Doe", "role": "Engineer", "commits": 1290}]'
></uf-table>`),
        react: code(`
const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'commits', label: 'Commits', sortable: true, align: 'end' },
];

<UfTable label="Team" columns={columns} rows={team} />`),
        vue: code(`
<script setup lang="ts">
import type { TableColumn } from '@unframed/core';
import { UfTable } from '@unframed/vue';

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'commits', label: 'Commits', sortable: true, align: 'end' },
];
</script>

<template>
  <UfTable label="Team" :columns="columns" :rows="team" />
</template>`),
        angular: code(`
<uf-table label="Team" [columns]="columns" [rows]="team" />`),
        notes: [
          'In plain HTML, `columns` and `rows` can be JSON attributes. From JavaScript, set them as properties.',
          'Give the table a `label`: it names the table for screen readers.',
        ],
      },
      {
        title: 'Formatting, and pages',
        description: '`format` turns a value into text or a DOM node, like a badge. Sorting still uses the raw values.',
        Preview: PagedInvoices,
        html: code(`
<uf-table id="invoices" label="Invoices" row-key="id"></uf-table>
<uf-pagination id="pages" label="Invoice pages"></uf-pagination>

<script type="module">
  const table = document.querySelector('#invoices');
  const pages = document.querySelector('#pages');
  const pageSize = 8;

  table.columns = [
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'end',
      format: (value) => euro.format(value) },
  ];
  pages.pages = Math.ceil(invoices.length / pageSize);

  const show = (page) => (table.rows = invoices.slice((page - 1) * pageSize, page * pageSize));
  pages.addEventListener('uf-page-change', (event) => show(event.detail.page));
  show(1);
</script>`),
        react: code(`
const [page, setPage] = useState(1);
const pageSize = 8;

<UfTable label="Invoices" columns={columns} rows={invoices.slice((page - 1) * pageSize, page * pageSize)} rowKey="id" />
<UfPagination
  label="Invoice pages"
  pages={Math.ceil(invoices.length / pageSize)}
  page={page}
  onUfPageChange={(event) => setPage(event.detail.page)}
/>`),
        vue: code(`
<UfTable label="Invoices" :columns="columns" :rows="invoices.slice((page - 1) * 8, page * 8)" row-key="id" />
<UfPagination
  label="Invoice pages"
  :pages="Math.ceil(invoices.length / 8)"
  :page="page"
  @uf-page-change="page = $event.detail.page"
/>`),
        angular: code(`
<uf-table label="Invoices" [columns]="columns" [rows]="pageRows()" rowKey="id" />
<uf-pagination
  label="Invoice pages"
  [pages]="pageCount"
  [page]="page()"
  (uf-page-change)="page.set($event.detail.page)"
/>`),
        notes: [
          'To sort on the server, add `manual-sort`: the table shows the sort and fires `uf-sort`, and you load the rows in that order.',
          'Set `--uf-table-max-height` to scroll long tables under a sticky header.',
        ],
      },
    ],
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    tags: ['uf-tabs', 'uf-tab', 'uf-tab-panel'],
    module: 'tabs',
    examples: [
      {
        title: 'Tabs and panels',
        Preview: () => (
          <div style={{ width: '100%' }}>
            <UfTabs label="Project settings">
              <UfTab panel="general">General</UfTab>
              <UfTab panel="members">Members</UfTab>
              <UfTab panel="billing">Billing</UfTab>
              <UfTabPanel name="general">General settings for the project.</UfTabPanel>
              <UfTabPanel name="members">Invite people and manage roles.</UfTabPanel>
              <UfTabPanel name="billing">Plans, invoices and payment methods.</UfTabPanel>
            </UfTabs>
          </div>
        ),
        html: code(`
<uf-tabs label="Project settings">
  <uf-tab panel="general">General</uf-tab>
  <uf-tab panel="members">Members</uf-tab>
  <uf-tab-panel name="general">General settings for the project.</uf-tab-panel>
  <uf-tab-panel name="members">Invite people and manage roles.</uf-tab-panel>
</uf-tabs>`),
        react: code(`
<UfTabs label="Project settings" onUfTabChange={(e) => setTab(e.detail.name)}>
  <UfTab panel="general">General</UfTab>
  <UfTab panel="members">Members</UfTab>
  <UfTabPanel name="general">General settings for the project.</UfTabPanel>
  <UfTabPanel name="members">Invite people and manage roles.</UfTabPanel>
</UfTabs>`),
        vue: code(`
<UfTabs label="Project settings" @uf-tab-change="(e) => (tab = e.detail.name)">
  <UfTab panel="general">General</UfTab>
  <UfTab panel="members">Members</UfTab>
  <UfTabPanel name="general">General settings for the project.</UfTabPanel>
  <UfTabPanel name="members">Invite people and manage roles.</UfTabPanel>
</UfTabs>`),
        angular: code(`
<uf-tabs label="Project settings" (uf-tab-change)="tab = $event.detail.name">
  <uf-tab panel="general">General</uf-tab>
  <uf-tab panel="members">Members</uf-tab>
  <uf-tab-panel name="general">General settings for the project.</uf-tab-panel>
  <uf-tab-panel name="members">Invite people and manage roles.</uf-tab-panel>
</uf-tabs>`),
      },
    ],
  },
  {
    slug: 'textarea',
    title: 'Textarea',
    tags: ['uf-textarea'],
    module: 'textarea',
    examples: [
      {
        title: 'Grows with its content',
        stack: true,
        Preview: () => <UfTextarea label="Bio" resize="auto" rows={2} maxlength={280} hint="Up to 280 characters." />,
        html: code(`<uf-textarea label="Bio" resize="auto" rows="2" maxlength="280" hint="Up to 280 characters."></uf-textarea>`),
        react: code(`<UfTextarea label="Bio" resize="auto" rows={2} maxlength={280} hint="Up to 280 characters." />`),
      },
    ],
  },
  {
    slug: 'toast',
    title: 'Toast',
    tags: ['uf-toaster'],
    module: 'toast',
    examples: [
      {
        title: 'Variants',
        description: 'Call `toast()` from anywhere; the toaster is created on first use.',
        Preview: () => (
          <>
            {(['neutral', 'info', 'success', 'warning', 'danger'] as ToastVariant[]).map((variant) => (
              <UfButton key={variant} variant="outline" onClick={() => toast(`This is a ${variant} toast.`, { variant })}>
                {variant}
              </UfButton>
            ))}
          </>
        ),
        html: code(`
<script type="module">
  import { toast } from '@unframed/core/toast';
  toast('Changes published.', { variant: 'success' });
</script>`),
        react: code(`
import { toast } from '@unframed/core/toast';

<UfButton onClick={() => toast('Changes published.', { variant: 'success' })}>Publish</UfButton>`),
        vue: code(`
<script setup>
import { toast } from '@unframed/core/toast';
</script>

<template>
  <UfButton @click="toast('Changes published.', { variant: 'success' })">Publish</UfButton>
</template>`),
        angular: code(`
import { toast } from '@unframed/core/toast';

// in your component
publish() {
  toast('Changes published.', { variant: 'success' });
}`),
      },
    ],
  },
  {
    slug: 'tooltip',
    title: 'Tooltip',
    tags: ['uf-tooltip'],
    module: 'tooltip',
    examples: [
      {
        title: 'On hover and focus',
        Preview: () => (
          <UfTooltip content="Saves without publishing">
            <UfButton variant="outline">Save draft</UfButton>
          </UfTooltip>
        ),
        html: code(`
<uf-tooltip content="Saves without publishing">
  <uf-button variant="outline">Save draft</uf-button>
</uf-tooltip>`),
        react: code(`
<UfTooltip content="Saves without publishing">
  <UfButton variant="outline">Save draft</UfButton>
</UfTooltip>`),
      },
    ],
  },
];

export function findPage(slug: string | undefined): Page | undefined {
  return pages.find((p) => p.slug === slug);
}
