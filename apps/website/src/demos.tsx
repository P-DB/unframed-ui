import { toast, type ToastVariant } from '@unframed/core';
import {
  UfAccordion,
  UfAccordionItem,
  UfButton,
  UfCheckbox,
  UfCombobox,
  UfDialog,
  UfDropdown,
  UfIcon,
  UfInput,
  UfMenu,
  UfMenuItem,
  UfPopover,
  UfRadio,
  UfRadioGroup,
  UfSelect,
  UfSwitch,
  UfTab,
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

export const pages: Page[] = [
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
          </>
        ),
        html: code(`
<uf-button>Primary</uf-button>
<uf-button variant="secondary">Secondary</uf-button>
<uf-button variant="outline">Outline</uf-button>
<uf-button variant="ghost">Ghost</uf-button>
<uf-button variant="danger">Danger</uf-button>`),
        react: code(`
<UfButton>Primary</UfButton>
<UfButton variant="secondary">Secondary</UfButton>
<UfButton variant="outline">Outline</UfButton>
<UfButton variant="ghost">Ghost</UfButton>
<UfButton variant="danger">Danger</UfButton>`),
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
          <form className="stack" style={{ display: 'grid', gap: '1rem' }} noValidate onSubmit={(e) => {
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
    slug: 'checkbox',
    title: 'Checkbox',
    tags: ['uf-checkbox'],
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
    ],
  },
];

export function findPage(slug: string | undefined): Page | undefined {
  return pages.find((p) => p.slug === slug);
}
