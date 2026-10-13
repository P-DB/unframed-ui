import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { controlsOf, spread, storyArg } from '../.storybook/args';

const menu = html`<uf-menu label="Project actions">
  <uf-menu-item value="edit">Edit<span slot="suffix">⌘E</span></uf-menu-item>
  <uf-menu-item value="duplicate">Duplicate<span slot="suffix">⌘D</span></uf-menu-item>
  <uf-menu-item value="archive" disabled>Archive</uf-menu-item>
  <hr />
  <uf-menu-item value="pin" type="checkbox" checked>Pinned</uf-menu-item>
  <uf-menu-item value="watch" type="checkbox">Watching</uf-menu-item>
  <hr />
  <uf-menu-item value="delete">Delete</uf-menu-item>
</uf-menu>`;

const trigger = html`<uf-button slot="trigger" variant="secondary">Actions<uf-icon slot="suffix" name="chevron-down"></uf-icon></uf-button>`;

const meta: Meta = {
  title: 'Components/Dropdown menu',
  component: 'uf-dropdown',
  subcomponents: { Menu: 'uf-menu', MenuItem: 'uf-menu-item' },
  args: { placement: 'bottom-start', distance: 6 },
  render: (a) => html`<div style="padding-bottom: 16rem">
    <uf-dropdown ${spread(a)}>${trigger}${menu}</uf-dropdown>
  </div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithIcons: Story = {
  name: 'Items with icons',
  render: () => html`<div style="padding-bottom: 12rem">
    <uf-dropdown>
      <uf-button slot="trigger" variant="outline" label="More actions"><uf-icon slot="prefix" name="plus"></uf-icon></uf-button>
      <uf-menu label="Create">
        <uf-menu-item value="issue"><uf-icon slot="prefix" name="info"></uf-icon>Issue</uf-menu-item>
        <uf-menu-item value="task"><uf-icon slot="prefix" name="check-circle"></uf-icon>Task</uf-menu-item>
        <uf-menu-item value="alert"><uf-icon slot="prefix" name="alert-triangle"></uf-icon>Alert</uf-menu-item>
      </uf-menu>
    </uf-dropdown>
  </div>`,
};

export const SelectEvent: Story = {
  name: 'Handling selection (uf-select)',
  render: () => html`<div style="padding-bottom: 16rem">
    <uf-dropdown
      @uf-select=${(e: CustomEvent<{ value: string; item: { checked: boolean; type: string } }>) => {
        const { value, item } = e.detail;
        const state = item.type === 'checkbox' ? ` (checked: ${item.checked})` : '';
        (e.currentTarget as Element).parentElement!.querySelector('output')!.textContent = `uf-select: ${value}${state}`;
      }}
    >
      ${trigger}${menu}
    </uf-dropdown>
    <output class="sb-note" style="display: block">Choose an item.</output>
  </div>`,
};

export const Placements: Story = {
  render: () => html`<div class="sb-row" style="padding: 12rem 0; justify-content: center">
    ${['top-start', 'bottom-end', 'right'].map(
      (placement) => html`<uf-dropdown placement=${placement}>
        <uf-button slot="trigger" variant="outline">${placement}</uf-button>
        <uf-menu label=${placement}>
          <uf-menu-item>One</uf-menu-item>
          <uf-menu-item>Two</uf-menu-item>
        </uf-menu>
      </uf-dropdown>`,
    )}
  </div>`,
};

const item = controlsOf('uf-menu-item', 'text');

export const MenuItem: Story = {
  name: 'Menu item',
  // Always open: on the docs page, render in a frame so the floating parts stay inside it.
  ...item,
  parameters: { ...item.parameters, docs: { story: { inline: false, height: '16rem' } } },
  args: { text: 'Notifications', value: 'notifications', type: 'checkbox', checked: true, disabled: false },
  argTypes: { ...item.argTypes, text: storyArg('the label (default slot).') },
  render: (a) => html`<div style="padding-bottom: 10rem">
    <uf-dropdown open>
      ${trigger}
      <uf-menu label="Settings">
        <uf-menu-item ${spread(a)}>${a.text}</uf-menu-item>
        <uf-menu-item value="other">Another item</uf-menu-item>
      </uf-menu>
    </uf-dropdown>
  </div>`,
};

export const MenuOnItsOwn: Story = {
  name: 'Menu without a dropdown',
  render: () => html`<uf-menu label="Formatting" style="max-width: 14rem; border: 1px solid var(--uf-color-border)">
    <uf-menu-item value="bold" type="checkbox" checked>Bold</uf-menu-item>
    <uf-menu-item value="italic" type="checkbox">Italic</uf-menu-item>
    <uf-menu-item value="clear">Clear formatting</uf-menu-item>
  </uf-menu>`,
};

export const Customized: Story = {
  args: { '--uf-popover-width': '16rem', '--uf-popover-padding': '0.5rem' },
};
