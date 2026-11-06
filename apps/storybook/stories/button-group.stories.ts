import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'];

const meta: Meta = {
  title: 'Components/Button group',
  component: 'uf-button-group',
  args: { label: 'Clipboard', orientation: 'horizontal', variant: 'outline' },
  argTypes: {
    // Not an attribute of the group: set on each button, to compare variants.
    variant: { control: 'inline-radio', options: variants },
  },
  render: ({ variant, ...a }) => html`<uf-button-group ${spread(a)}>
    <uf-button variant=${variant}>Cut</uf-button>
    <uf-button variant=${variant}>Copy</uf-button>
    <uf-button variant=${variant}>Paste</uf-button>
  </uf-button-group>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  argTypes: { variant: { table: { disable: true } } },
  render: () => html`<div class="sb-stack">
    ${variants.map(
      (variant) => html`<uf-button-group label=${variant}>
        <uf-button variant=${variant}>Cut</uf-button>
        <uf-button variant=${variant}>Copy</uf-button>
        <uf-button variant=${variant}>Paste</uf-button>
      </uf-button-group>`,
    )}
  </div>`,
};

export const SplitButton: Story = {
  name: 'Split button',
  argTypes: { variant: { table: { disable: true } } },
  render: () => html`<uf-button-group label="Save">
    <uf-button>Save</uf-button>
    <uf-dropdown placement="bottom-end">
      <uf-button slot="trigger" label="More ways to save"><uf-icon slot="prefix" name="chevron-down"></uf-icon></uf-button>
      <uf-menu label="Save">
        <uf-menu-item value="draft">Save as draft</uf-menu-item>
        <uf-menu-item value="template">Save as template</uf-menu-item>
      </uf-menu>
    </uf-dropdown>
  </uf-button-group>`,
};

export const Vertical: Story = {
  args: { orientation: 'vertical', label: 'Align' },
};

export const Customized: Story = {
  name: 'Custom properties',
  args: { '--uf-button-radius': '999px' },
};
