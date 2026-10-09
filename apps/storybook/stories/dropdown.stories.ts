import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Dropdown menu',
  component: 'uf-dropdown',
  subcomponents: { Menu: 'uf-menu', MenuItem: 'uf-menu-item' },
  args: { placement: 'bottom-start' },
  render: (a) => html`<uf-dropdown placement=${a.placement}>
    <uf-button slot="trigger" variant="secondary">Actions<uf-icon slot="suffix" name="chevron-down"></uf-icon></uf-button>
    <uf-menu label="Project actions">
      <uf-menu-item value="edit">Edit<span slot="suffix">⌘E</span></uf-menu-item>
      <uf-menu-item value="duplicate">Duplicate<span slot="suffix">⌘D</span></uf-menu-item>
      <uf-menu-item value="archive" disabled>Archive</uf-menu-item>
      <hr />
      <uf-menu-item value="pin" type="checkbox" checked>Pinned</uf-menu-item>
      <uf-menu-item value="watch" type="checkbox">Watching</uf-menu-item>
      <hr />
      <uf-menu-item value="delete">Delete</uf-menu-item>
    </uf-menu>
  </uf-dropdown>`,
};
export default meta;

export const Default: StoryObj = {};
