import { registerIcons, toast, type TableColumn, type ToastVariant } from '@unframed/core';
import {
  UfAccordion,
  UfAccordionItem,
  UfAlert,
  UfAvatar,
  UfBadge,
  UfBreadcrumbItem,
  UfBreadcrumbs,
  UfButton,
  UfCalendar,
  UfCard,
  UfCheckbox,
  UfCheckboxGroup,
  UfCombobox,
  UfDatePicker,
  UfDateRangePicker,
  UfDialog,
  UfDivider,
  UfDrawer,
  UfDropdown,
  UfFileUpload,
  UfIcon,
  UfInput,
  UfNumberInput,
  UfMenu,
  UfMenuItem,
  UfPagination,
  UfPopover,
  UfProgress,
  UfRadio,
  UfRadioGroup,
  UfSelect,
  UfSkeleton,
  UfSlider,
  UfSpinner,
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

/** The local date `offset` days from today, as YYYY-MM-DD, so date examples stay current. */
const isoDay = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().slice(0, 10);
};
const weekend = (iso: string) => [0, 6].includes(new Date(iso).getUTCDay());

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
const invoices = Array.from({ length: 32 }, (_, i) => ({
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
    slug: 'alert',
    title: 'Alert',
    tags: ['uf-alert'],
    module: 'alert',
    examples: [
      {
        title: 'Variants',
        description: 'Six colors by meaning, each with its icon. `info` is the default.',
        stack: true,
        Preview: () => (
          <>
            <UfAlert variant="neutral">Drafts are kept for 30 days.</UfAlert>
            <UfAlert variant="accent">You were invited to the Acme workspace.</UfAlert>
            <UfAlert>A new version is available.</UfAlert>
            <UfAlert variant="success">Your changes were published.</UfAlert>
            <UfAlert variant="warning">Your trial ends in 3 days.</UfAlert>
            <UfAlert variant="danger">We couldn't charge your card.</UfAlert>
          </>
        ),
        html: code(`
<uf-alert>A new version is available.</uf-alert>
<uf-alert variant="success">Your changes were published.</uf-alert>
<uf-alert variant="warning">Your trial ends in 3 days.</uf-alert>
<uf-alert variant="danger">We couldn't charge your card.</uf-alert>`),
        react: code(`
<UfAlert>A new version is available.</UfAlert>
<UfAlert variant="success">Your changes were published.</UfAlert>
<UfAlert variant="warning">Your trial ends in 3 days.</UfAlert>
<UfAlert variant="danger">We couldn't charge your card.</UfAlert>`),
        notes: [
          '`warning` and `danger` alerts are announced right away, the others politely. Assistive tech announces an alert when it appears, so add it to the page (or `show()` it) when the message happens.',
        ],
      },
      {
        title: 'Heading and actions',
        stack: true,
        Preview: () => (
          <UfAlert variant="warning" heading="Your trial ends in 3 days">
            Choose a plan to keep your projects and invoices.
            <UfButton slot="actions" size="sm">
              Choose a plan
            </UfButton>
            <UfButton slot="actions" size="sm" variant="ghost">
              Remind me later
            </UfButton>
          </UfAlert>
        ),
        html: code(`
<uf-alert variant="warning" heading="Your trial ends in 3 days">
  Choose a plan to keep your projects and invoices.
  <uf-button slot="actions" size="sm">Choose a plan</uf-button>
  <uf-button slot="actions" size="sm" variant="ghost">Remind me later</uf-button>
</uf-alert>`),
        react: code(`
<UfAlert variant="warning" heading="Your trial ends in 3 days">
  Choose a plan to keep your projects and invoices.
  <UfButton slot="actions" size="sm">Choose a plan</UfButton>
  <UfButton slot="actions" size="sm" variant="ghost">Remind me later</UfButton>
</UfAlert>`),
      },
      {
        title: 'Closable',
        description: '`closable` adds a close button that hides the alert and emits `uf-hide`. `show()` brings it back.',
        stack: true,
        Preview: () => {
          const [open, setOpen] = useState(true);
          return (
            <>
              <UfAlert variant="success" closable hidden={!open} onUfHide={() => setOpen(false)}>
                Your changes were saved.
              </UfAlert>
              {!open && (
                <div>
                  <UfButton size="sm" variant="outline" onClick={() => setOpen(true)}>
                    Show it again
                  </UfButton>
                </div>
              )}
            </>
          );
        },
        html: code(`
<uf-alert variant="success" closable>Your changes were saved.</uf-alert>

<script>
  document.querySelector('uf-alert').addEventListener('uf-hide', () => console.log('closed'));
</script>`),
        react: code(`
const [open, setOpen] = useState(true);

<UfAlert variant="success" closable hidden={!open} onUfHide={() => setOpen(false)}>
  Your changes were saved.
</UfAlert>`),
        vue: code(`
<script setup>
const open = ref(true);
</script>

<template>
  <UfAlert variant="success" closable :hidden="!open" @uf-hide="open = false">
    Your changes were saved.
  </UfAlert>
</template>`),
        angular: code(`
<uf-alert variant="success" closable [hidden]="!open" (uf-hide)="open = false">
  Your changes were saved.
</uf-alert>`),
      },
      {
        title: 'Without an icon, or with your own',
        stack: true,
        Preview: () => (
          <>
            <UfAlert variant="neutral" withoutIcon>
              Maintenance on Sunday from 02:00 to 04:00 UTC.
            </UfAlert>
            <UfAlert variant="accent">
              <UfIcon slot="icon" name="user" />
              John Smith shared a project with you.
            </UfAlert>
          </>
        ),
        html: code(`
<uf-alert variant="neutral" without-icon>Maintenance on Sunday from 02:00 to 04:00 UTC.</uf-alert>
<uf-alert variant="accent">
  <uf-icon slot="icon" name="user"></uf-icon>
  John Smith shared a project with you.
</uf-alert>`),
        react: code(`
<UfAlert variant="neutral" withoutIcon>Maintenance on Sunday from 02:00 to 04:00 UTC.</UfAlert>
<UfAlert variant="accent">
  <UfIcon slot="icon" name="user" />
  John Smith shared a project with you.
</UfAlert>`),
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
    slug: 'breadcrumbs',
    title: 'Breadcrumbs',
    tags: ['uf-breadcrumbs', 'uf-breadcrumb-item'],
    module: 'breadcrumbs',
    examples: [
      {
        title: 'Basic',
        description: 'The last item is the current page: it is not a link, and screen readers announce it as the current page.',
        Preview: () => (
          <UfBreadcrumbs>
            <UfBreadcrumbItem href="#">Home</UfBreadcrumbItem>
            <UfBreadcrumbItem href="#">Docs</UfBreadcrumbItem>
            <UfBreadcrumbItem href="#">Theming</UfBreadcrumbItem>
          </UfBreadcrumbs>
        ),
        html: code(`
<uf-breadcrumbs>
  <uf-breadcrumb-item href="/">Home</uf-breadcrumb-item>
  <uf-breadcrumb-item href="/docs">Docs</uf-breadcrumb-item>
  <uf-breadcrumb-item>Theming</uf-breadcrumb-item>
</uf-breadcrumbs>`),
        react: code(`
<UfBreadcrumbs>
  <UfBreadcrumbItem href="/">Home</UfBreadcrumbItem>
  <UfBreadcrumbItem href="/docs">Docs</UfBreadcrumbItem>
  <UfBreadcrumbItem>Theming</UfBreadcrumbItem>
</UfBreadcrumbs>`),
        notes: [
          'It is a navigation landmark named "Breadcrumb" (translatable), or `label`. Name it differently if a page has two.',
          'Separators are hidden from screen readers, which announce the trail as a list.',
        ],
      },
      {
        title: 'Custom separator and an icon',
        description: 'Put any element in the `separator` slot: it is copied between the items.',
        Preview: () => (
          <UfBreadcrumbs>
            <span slot="separator">/</span>
            <UfBreadcrumbItem href="#">
              <UfIcon slot="prefix" name="user" />
              John Smith
            </UfBreadcrumbItem>
            <UfBreadcrumbItem href="#">Projects</UfBreadcrumbItem>
            <UfBreadcrumbItem>Website redesign</UfBreadcrumbItem>
          </UfBreadcrumbs>
        ),
        html: code(`
<uf-breadcrumbs>
  <span slot="separator">/</span>
  <uf-breadcrumb-item href="/people/john-smith">
    <uf-icon slot="prefix" name="user"></uf-icon>John Smith
  </uf-breadcrumb-item>
  <uf-breadcrumb-item href="/people/john-smith/projects">Projects</uf-breadcrumb-item>
  <uf-breadcrumb-item>Website redesign</uf-breadcrumb-item>
</uf-breadcrumbs>`),
        react: code(`
<UfBreadcrumbs>
  <span slot="separator">/</span>
  <UfBreadcrumbItem href="/people/john-smith">
    <UfIcon slot="prefix" name="user" />John Smith
  </UfBreadcrumbItem>
  <UfBreadcrumbItem href="/people/john-smith/projects">Projects</UfBreadcrumbItem>
  <UfBreadcrumbItem>Website redesign</UfBreadcrumbItem>
</UfBreadcrumbs>`),
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
        title: 'Appearance and orientation',
        Preview: () => (
          <>
            {(['outline', 'elevated', 'filled'] as const).map((appearance) => (
              <UfCard key={appearance} appearance={appearance} style={{ width: '10rem' }}>
                <strong slot="header">{appearance}</strong>A card.
              </UfCard>
            ))}
          </>
        ),
        html: code(`
<uf-card appearance="elevated">…</uf-card>
<uf-card appearance="filled">…</uf-card>
<uf-card orientation="horizontal">
  <img slot="media" src="/cover.png" alt="" />
  Media beside the content.
</uf-card>`),
        react: code(`
<UfCard appearance="elevated">…</UfCard>
<UfCard appearance="filled">…</UfCard>
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
    slug: 'date-range-picker',
    title: 'Date range picker',
    tags: ['uf-date-range-picker', 'uf-calendar'],
    module: 'date-range-picker',
    examples: [
      {
        title: 'Basic',
        description: 'Type the two dates, or pick them in the calendar: the first click sets the start, the second the end.',
        stack: true,
        Preview: () => {
          const [stay, setStay] = useState('');
          return (
            <>
              <UfDateRangePicker
                name="stay"
                label="Stay"
                hint="Check-in from 3 pm"
                value={stay}
                onChange={(event) => setStay((event.target as HTMLElement & { value: string }).value)}
              />
              <span style={{ color: 'var(--uf-color-text-muted)', fontSize: '0.875rem' }}>Value: {stay || '(empty)'}</span>
            </>
          );
        },
        html: code(`<uf-date-range-picker name="stay" label="Stay" hint="Check-in from 3 pm"></uf-date-range-picker>`),
        react: code(`
const [stay, setStay] = useState('');

<UfDateRangePicker
  name="stay"
  label="Stay"
  value={stay}
  onChange={(event) => setStay((event.target as UfDateRangePickerElement).value)}
/>`),
        vue: code(`
<script setup>
const stay = ref('');
</script>

<template>
  <UfDateRangePicker v-model="stay" name="stay" label="Stay" />
</template>`),
        angular: code(`<uf-date-range-picker [(ngModel)]="stay" name="stay" label="Stay" />`),
        notes: [
          'The value is an ISO 8601 interval, `2026-10-14/2026-10-18`, the same in every language; `start` and `end` hold the two dates.',
          'The format, month names and first day of the week follow the nearest `lang`.',
        ],
      },
      {
        title: 'Limits and validation',
        description: '`min`, `max` and `isDateDisabled`, as in the date picker. A missing or reversed date gets its own message.',
        stack: true,
        Preview: () => (
          <form
            style={{ display: 'grid', gap: '0.75rem' }}
            onSubmit={(event) => {
              event.preventDefault();
              toast('Dates saved', { variant: 'success' });
            }}
          >
            <UfDateRangePicker name="leave" label="Leave" hint="Weekdays, within the next 90 days" required min={isoDay(0)} max={isoDay(90)} isDateDisabled={weekend} />
            <div>
              <UfButton type="submit">Request leave</UfButton>
            </div>
          </form>
        ),
        html: code(`
<uf-date-range-picker name="leave" label="Leave" required min="2026-10-20" max="2027-01-18"></uf-date-range-picker>
<script>
  // A function, so it's set as a property.
  document.querySelector('uf-date-range-picker').isDateDisabled = (iso) => [0, 6].includes(new Date(iso).getUTCDay());
</script>`),
        react: code(`
<UfDateRangePicker
  name="leave"
  label="Leave"
  required
  min="2026-10-20"
  max="2027-01-18"
  isDateDisabled={(iso) => [0, 6].includes(new Date(iso).getUTCDay())}
/>`),
      },
      {
        title: 'Calendar on its own',
        description: '`<uf-calendar range>` picks a range inline, e.g. on a booking page. `change` fires when both dates are picked.',
        Preview: () => <UfCalendar range start={isoDay(2)} end={isoDay(6)} />,
        html: code(`<uf-calendar range start="2026-10-22" end="2026-10-26"></uf-calendar>`),
        react: code(`<UfCalendar range start="2026-10-22" end="2026-10-26" onChange={(event) => …} />`),
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
    slug: 'divider',
    title: 'Divider',
    tags: ['uf-divider'],
    module: 'divider',
    examples: [
      {
        title: 'Between sections, or with a label',
        stack: true,
        Preview: () => (
          <>
            <span>Profile</span>
            <UfDivider />
            <span>Notifications</span>
            <UfDivider>or</UfDivider>
            <UfButton variant="outline">Continue with GitHub</UfButton>
          </>
        ),
        html: code(`
<section>Profile</section>
<uf-divider></uf-divider>
<section>Notifications</section>

<uf-divider>or</uf-divider>`),
        react: code(`
<section>Profile</section>
<UfDivider />
<section>Notifications</section>

<UfDivider>or</UfDivider>`),
        notes: ['Screen readers announce a divider as a separator. A label is read as plain text, so keep it short, like "or".'],
      },
      {
        title: 'Vertical',
        description: 'Between items in a row. It takes the height of the row.',
        Preview: () => (
          <div style={{ display: 'flex', alignItems: 'center', height: '1.5rem' }}>
            <UfButton variant="link">Edit</UfButton>
            <UfDivider orientation="vertical" />
            <UfButton variant="link">Duplicate</UfButton>
            <UfDivider orientation="vertical" />
            <UfButton variant="link">Archive</UfButton>
          </div>
        ),
        html: code(`
<div style="display: flex; align-items: center">
  <uf-button variant="link">Edit</uf-button>
  <uf-divider orientation="vertical"></uf-divider>
  <uf-button variant="link">Duplicate</uf-button>
</div>`),
        react: code(`
<div style={{ display: 'flex', alignItems: 'center' }}>
  <UfButton variant="link">Edit</UfButton>
  <UfDivider orientation="vertical" />
  <UfButton variant="link">Duplicate</UfButton>
</div>`),
      },
    ],
  },
  {
    slug: 'drawer',
    title: 'Drawer',
    tags: ['uf-drawer'],
    module: 'drawer',
    examples: [
      {
        title: 'Filters',
        description: 'A modal panel from the end edge. Escape, the close button and any element with `data-dialog="close"` close it.',
        Preview: () => {
          const [open, setOpen] = useState(false);
          return (
            <>
              <UfButton variant="outline" onClick={() => setOpen(true)}>
                Filters
              </UfButton>
              <UfDrawer label="Filters" open={open} lightDismiss onUfHide={() => setOpen(false)}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <UfCheckboxGroup label="Status">
                    <UfCheckbox value="open">Open</UfCheckbox>
                    <UfCheckbox value="closed">Closed</UfCheckbox>
                  </UfCheckboxGroup>
                  <UfSlider label="Maximum price" max={500} step={10} value={250} showValue />
                </div>
                <UfButton slot="footer" variant="ghost" data-dialog="close">
                  Cancel
                </UfButton>
                <UfButton slot="footer" data-dialog="close">
                  Apply
                </UfButton>
              </UfDrawer>
            </>
          );
        },
        html: code(`
<uf-button variant="outline" onclick="this.nextElementSibling.show()">Filters</uf-button>
<uf-drawer label="Filters" light-dismiss>
  <uf-checkbox-group label="Status">
    <uf-checkbox value="open">Open</uf-checkbox>
    <uf-checkbox value="closed">Closed</uf-checkbox>
  </uf-checkbox-group>
  <uf-button slot="footer" variant="ghost" data-dialog="close">Cancel</uf-button>
  <uf-button slot="footer" data-dialog="close">Apply</uf-button>
</uf-drawer>`),
        react: code(`
const [open, setOpen] = useState(false);

<UfButton variant="outline" onClick={() => setOpen(true)}>Filters</UfButton>
<UfDrawer label="Filters" open={open} lightDismiss onUfHide={() => setOpen(false)}>
  …
  <UfButton slot="footer" data-dialog="close">Apply</UfButton>
</UfDrawer>`),
        vue: code(`
<script setup>
const drawer = ref();
</script>

<template>
  <UfButton variant="outline" @click="drawer.el.show()">Filters</UfButton>
  <UfDrawer ref="drawer" label="Filters" light-dismiss>
    …
    <UfButton slot="footer" data-dialog="close">Apply</UfButton>
  </UfDrawer>
</template>`),
        angular: code(`
<uf-button variant="outline" (click)="drawer.el.show()">Filters</uf-button>
<uf-drawer #drawer label="Filters" light-dismiss>
  …
  <uf-button slot="footer" data-dialog="close">Apply</uf-button>
</uf-drawer>`),
        notes: ['It is a modal dialog: focus stays inside, the page behind is inert and does not scroll, and focus returns to the button on close.'],
      },
      {
        title: 'Placement',
        description: '`start`, `end` (the default), `top` or `bottom`. Start and end follow the page direction. `--uf-drawer-size` sets the width, or the height for top and bottom.',
        Preview: () => {
          const [placement, setPlacement] = useState<'start' | 'end' | 'top' | 'bottom' | null>(null);
          return (
            <>
              {(['start', 'end', 'top', 'bottom'] as const).map((p) => (
                <UfButton key={p} variant="outline" onClick={() => setPlacement(p)}>
                  {p}
                </UfButton>
              ))}
              <UfDrawer label={`Placement: ${placement}`} placement={placement ?? 'end'} open={placement !== null} lightDismiss onUfHide={() => setPlacement(null)}>
                Slides in from the {placement} edge.
              </UfDrawer>
            </>
          );
        },
        html: code(`
<uf-drawer label="Menu" placement="start">…</uf-drawer>
<uf-drawer label="Cart" placement="end" style="--uf-drawer-size: 28rem">…</uf-drawer>
<uf-drawer label="Cookies" placement="bottom">…</uf-drawer>`),
        react: code(`
<UfDrawer label="Menu" placement="start">…</UfDrawer>
<UfDrawer label="Cart" placement="end" style={{ '--uf-drawer-size': '28rem' }}>…</UfDrawer>
<UfDrawer label="Cookies" placement="bottom">…</UfDrawer>`),
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
    slug: 'file-upload',
    title: 'File upload',
    tags: ['uf-file-upload'],
    module: 'file-upload',
    examples: [
      {
        title: 'Basic',
        description: 'A button and a drop zone. The chosen files are listed with their size and a remove button.',
        stack: true,
        Preview: () => {
          const [files, setFiles] = useState<File[]>([]);
          return (
            <>
              <UfFileUpload
                name="attachments"
                label="Attachments"
                hint="PDF or images, up to 5 MB each"
                multiple
                accept=".pdf, image/*"
                maxSize={5_000_000}
                onChange={(event) => setFiles([...(event.target as HTMLElement & { files: File[] }).files])}
              />
              <span style={{ color: 'var(--uf-color-text-muted)', fontSize: '0.875rem' }}>
                {files.length ? `${files.length} file${files.length > 1 ? 's' : ''} chosen` : 'No files yet'}
              </span>
            </>
          );
        },
        html: code(`<uf-file-upload name="attachments" label="Attachments" hint="PDF or images, up to 5 MB each" multiple accept=".pdf, image/*" max-size="5000000"></uf-file-upload>`),
        react: code(`
const [files, setFiles] = useState<File[]>([]);

<UfFileUpload
  name="attachments"
  label="Attachments"
  multiple
  accept=".pdf, image/*"
  maxSize={5_000_000}
  onChange={(event) => setFiles((event.target as UfFileUploadElement).files)}
/>`),
        vue: code(`
<script setup>
const files = ref([]);
</script>

<template>
  <UfFileUpload v-model="files" name="attachments" label="Attachments" multiple accept=".pdf, image/*" :max-size="5000000" />
</template>`),
        angular: code(`<uf-file-upload [(ngModel)]="files" name="attachments" label="Attachments" multiple accept=".pdf, image/*" max-size="5000000" />`),
        notes: [
          'Files that `accept` rules out, or larger than `max-size` (in bytes), are refused, with a message saying why.',
          'It submits with its form like a native file input: `new FormData(form).getAll("attachments")` returns the files.',
        ],
      },
      {
        title: 'One file, required',
        description: 'Without `multiple`, a new pick replaces the file. `required` makes the form ask for one.',
        stack: true,
        Preview: () => (
          <form
            style={{ display: 'grid', gap: '0.75rem' }}
            onSubmit={(event) => {
              event.preventDefault();
              toast('CV sent', { variant: 'success' });
            }}
          >
            <UfFileUpload name="cv" label="Your CV" accept=".pdf" required />
            <div>
              <UfButton type="submit">Apply</UfButton>
            </div>
          </form>
        ),
        html: code(`
<form>
  <uf-file-upload name="cv" label="Your CV" accept=".pdf" required></uf-file-upload>
  <uf-button type="submit">Apply</uf-button>
</form>`),
        react: code(`
<form onSubmit={apply}>
  <UfFileUpload name="cv" label="Your CV" accept=".pdf" required />
  <UfButton type="submit">Apply</UfButton>
</form>`),
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
            {['check', 'x', 'plus', 'search', 'info', 'check-circle', 'alert-triangle', 'alert-circle', 'chevron-down', 'sun', 'moon', 'calendar', 'user', 'upload', 'file'].map(
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
    slug: 'number-input',
    title: 'Number input',
    tags: ['uf-number-input'],
    module: 'number-input',
    examples: [
      {
        title: 'Basic',
        description: 'The value is a number, or `null` while the field is empty. The buttons and the arrow keys step it, within `min` and `max`.',
        stack: true,
        Preview: () => {
          const [guests, setGuests] = useState<number | null>(2);
          return (
            <>
              <UfNumberInput
                label="Guests"
                hint="Up to 10"
                min={1}
                max={10}
                value={guests}
                onInput={(e) => setGuests((e.currentTarget as unknown as { value: number | null }).value)}
              />
              <span style={{ color: 'var(--uf-color-text-muted)', fontSize: '0.875rem' }}>Value: {String(guests)}</span>
            </>
          );
        },
        html: code(`
<uf-number-input name="guests" label="Guests" hint="Up to 10" value="2" min="1" max="10"></uf-number-input>`),
        react: code(`
const [guests, setGuests] = useState<number | null>(2);

<UfNumberInput label="Guests" min={1} max={10} value={guests} onInput={(e) => setGuests(e.currentTarget.value)} />`),
        vue: code(`
<script setup>
const guests = ref(2);
</script>

<template>
  <UfNumberInput v-model="guests" label="Guests" :min="1" :max="10" />
</template>`),
        angular: code(`
<!-- guests: number | null = 2 -->
<uf-number-input [(ngModel)]="guests" label="Guests" min="1" max="10"></uf-number-input>`),
      },
      {
        title: 'Steps, units and validation',
        description: '`step` sets how much the buttons move, and the value must be a multiple of it. Put a unit or a currency in the `prefix` or `suffix` slot.',
        stack: true,
        Preview: () => (
          <>
            <UfNumberInput label="Price" value={9.5} step={0.5} min={0}>
              <span slot="prefix">€</span>
            </UfNumberInput>
            <UfNumberInput label="Weight" value={250} step={50} min={0} required>
              <span slot="suffix">g</span>
            </UfNumberInput>
          </>
        ),
        html: code(`
<uf-number-input label="Price" value="9.5" step="0.5" min="0">
  <span slot="prefix">€</span>
</uf-number-input>
<uf-number-input label="Weight" value="250" step="50" min="0" required>
  <span slot="suffix">g</span>
</uf-number-input>`),
        react: code(`
<UfNumberInput label="Price" value={9.5} step={0.5} min={0}>
  <span slot="prefix">€</span>
</UfNumberInput>
<UfNumberInput label="Weight" value={250} step={50} min={0} required>
  <span slot="suffix">g</span>
</UfNumberInput>`),
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
    slug: 'progress',
    title: 'Progress',
    tags: ['uf-progress'],
    module: 'progress',
    examples: [
      {
        title: 'Value',
        description: '`value` out of `max` (100 by default). `show-value` adds the percentage.',
        stack: true,
        Preview: () => (
          <>
            <UfProgress label="Uploading report.pdf" value={45} showValue />
            <UfProgress label="Storage" value={92} variant="warning" showValue />
            <UfProgress label="Profile complete" value={5} max={5} variant="success" size="sm" />
          </>
        ),
        html: code(`
<uf-progress label="Uploading report.pdf" value="45" show-value></uf-progress>
<uf-progress label="Storage" value="92" variant="warning" show-value></uf-progress>
<uf-progress label="Profile complete" value="5" max="5" variant="success" size="sm"></uf-progress>`),
        react: code(`
<UfProgress label="Uploading report.pdf" value={45} showValue />
<UfProgress label="Storage" value={92} variant="warning" showValue />
<UfProgress label="Profile complete" value={5} max={5} variant="success" size="sm" />`),
        notes: ['Screen readers announce it as a progress bar with its label and percentage. Without a `label`, it is named "Progress" (translatable).'],
      },
      {
        title: 'Indeterminate',
        description: 'Leave out `value` when the length of the work is not known.',
        stack: true,
        Preview: () => <UfProgress label="Preparing your export" />,
        html: code(`<uf-progress label="Preparing your export"></uf-progress>`),
        react: code(`<UfProgress label="Preparing your export" />`),
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
    slug: 'skeleton',
    title: 'Skeleton',
    tags: ['uf-skeleton'],
    module: 'skeleton',
    examples: [
      {
        title: 'Shapes',
        description: 'Lines of text (`lines`), a circle or a block (`rect`), sized with CSS. A shimmer sweeps across them, except for people who asked for less motion.',
        stack: true,
        Preview: () => (
          <div aria-busy="true" style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <UfSkeleton shape="circle" />
              <UfSkeleton lines={3} style={{ flex: 1 }} />
            </div>
            <UfSkeleton shape="rect" />
          </div>
        ),
        html: code(`
<div aria-busy="true">
  <uf-skeleton shape="circle"></uf-skeleton>
  <uf-skeleton lines="3"></uf-skeleton>

  <uf-skeleton shape="rect"></uf-skeleton>
</div>`),
        react: code(`
<div aria-busy="true">
  <UfSkeleton shape="circle" />
  <UfSkeleton lines={3} />

  <UfSkeleton shape="rect" />
</div>`),
        notes: [
          'Skeletons are hidden from screen readers. Mark the region that is loading with `aria-busy="true"`, and remove it when the content arrives.',
        ],
      },
      {
        title: 'A card while it loads',
        Preview: () => (
          <UfCard style={{ width: '16rem' }} aria-busy="true">
            <UfSkeleton slot="media" shape="rect" style={{ height: '8rem' }} />
            <UfSkeleton slot="header" style={{ width: '60%' }} />
            <UfSkeleton lines={2} />
          </UfCard>
        ),
        html: code(`
<uf-card aria-busy="true">
  <uf-skeleton slot="media" shape="rect" style="height: 8rem"></uf-skeleton>
  <uf-skeleton slot="header" style="width: 60%"></uf-skeleton>
  <uf-skeleton lines="2"></uf-skeleton>
</uf-card>`),
        react: code(`
<UfCard aria-busy="true">
  <UfSkeleton slot="media" shape="rect" style={{ height: '8rem' }} />
  <UfSkeleton slot="header" style={{ width: '60%' }} />
  <UfSkeleton lines={2} />
</UfCard>`),
      },
    ],
  },
  {
    slug: 'slider',
    title: 'Slider',
    tags: ['uf-slider'],
    module: 'slider',
    examples: [
      {
        title: 'Basic',
        description: 'A native range input underneath: arrow keys, Page Up/Down, Home and End, touch, and screen readers work as everywhere.',
        stack: true,
        Preview: () => {
          const [volume, setVolume] = useState(40);
          return (
            <UfSlider
              label="Volume"
              hint="Applies to every device"
              value={volume}
              showValue
              onInput={(event) => setVolume((event.target as HTMLInputElement & { value: number }).value)}
            />
          );
        },
        html: code(`<uf-slider name="volume" label="Volume" hint="Applies to every device" value="40" show-value></uf-slider>`),
        react: code(`
const [volume, setVolume] = useState(40);

<UfSlider
  label="Volume"
  value={volume}
  showValue
  onInput={(event) => setVolume((event.target as UfSliderElement).value)}
/>`),
        vue: code(`
<script setup>
const volume = ref(40);
</script>

<template>
  <UfSlider v-model="volume" label="Volume" show-value />
</template>`),
        angular: code(`<uf-slider [(ngModel)]="volume" label="Volume" show-value />`),
        notes: ['The value is a number. It submits with its form, and `input` fires while dragging, `change` when the user lets go.'],
      },
      {
        title: 'Range and step',
        description: '`min`, `max` and `step`. The value always lands on a step within the range.',
        stack: true,
        Preview: () => (
          <>
            <UfSlider label="Maximum price (€)" min={0} max={500} step={10} value={250} showValue />
            <UfSlider label="Rating" min={1} max={5} value={4} showValue disabled />
          </>
        ),
        html: code(`
<uf-slider label="Maximum price (€)" min="0" max="500" step="10" value="250" show-value></uf-slider>
<uf-slider label="Rating" min="1" max="5" value="4" show-value disabled></uf-slider>`),
        react: code(`
<UfSlider label="Maximum price (€)" min={0} max={500} step={10} value={250} showValue />
<UfSlider label="Rating" min={1} max={5} value={4} showValue disabled />`),
      },
    ],
  },
  {
    slug: 'spinner',
    title: 'Spinner',
    tags: ['uf-spinner'],
    module: 'spinner',
    examples: [
      {
        title: 'Sizes',
        description: '`sm`, `md` (the default) or `lg`, or any size with `--uf-spinner-size`.',
        Preview: () => (
          <>
            <UfSpinner size="sm" />
            <UfSpinner />
            <UfSpinner size="lg" />
            <UfSpinner style={{ '--uf-spinner-size': '3.5rem' } as React.CSSProperties} />
          </>
        ),
        html: code(`
<uf-spinner size="sm"></uf-spinner>
<uf-spinner></uf-spinner>
<uf-spinner size="lg"></uf-spinner>
<uf-spinner style="--uf-spinner-size: 3.5rem"></uf-spinner>`),
        react: code(`
<UfSpinner size="sm" />
<UfSpinner />
<UfSpinner size="lg" />
<UfSpinner style={{ '--uf-spinner-size': '3.5rem' }} />`),
      },
      {
        title: 'Label and color',
        description: 'Screen readers announce "Loading" (translatable), or `label`. Colors come from the theme, or `--uf-spinner-indicator-color`.',
        Preview: () => (
          <>
            <UfSpinner label="Loading John Smith's orders" />
            <UfSpinner label="Saving" style={{ '--uf-spinner-indicator-color': 'var(--uf-color-success)' } as React.CSSProperties} />
          </>
        ),
        html: code(`
<uf-spinner label="Loading John Smith's orders"></uf-spinner>
<uf-spinner label="Saving" style="--uf-spinner-indicator-color: var(--uf-color-success)"></uf-spinner>`),
        react: code(`
<UfSpinner label="Loading John Smith's orders" />
<UfSpinner label="Saving" style={{ '--uf-spinner-indicator-color': 'var(--uf-color-success)' }} />`),
        notes: ['For a button that is busy, use the button\'s `loading` instead: it keeps the button focusable and its label for screen readers.'],
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
