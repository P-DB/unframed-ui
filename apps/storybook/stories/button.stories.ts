import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

interface Args {
  label: string;
  variant: string;
  size: string;
  disabled: boolean;
  loading: boolean;
  href?: string;
}

const meta: Meta<Args> = {
  title: 'Components/Button',
  component: 'uf-button',
  args: { label: 'Button', variant: 'primary', size: 'md', disabled: false, loading: false },
  argTypes: {
    label: { control: 'text', description: 'Story only: the button text (default slot).' },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (a) => html`<uf-button
    variant=${a.variant}
    size=${a.size}
    ?disabled=${a.disabled}
    ?loading=${a.loading}
    href=${ifDefined(a.href || undefined)}
    >${a.label}</uf-button
  >`,
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => html`<div class="sb-row">
    <uf-button>Primary</uf-button>
    <uf-button variant="secondary">Secondary</uf-button>
    <uf-button variant="outline">Outline</uf-button>
    <uf-button variant="ghost">Ghost</uf-button>
    <uf-button variant="danger">Danger</uf-button>
  </div>`,
};

export const Sizes: Story = {
  render: () => html`<div class="sb-row">
    <uf-button size="sm">Small</uf-button>
    <uf-button size="md">Medium</uf-button>
    <uf-button size="lg">Large</uf-button>
  </div>`,
};

export const WithIcons: Story = {
  render: () => html`<div class="sb-row">
    <uf-button><uf-icon slot="prefix" name="plus"></uf-icon>New item</uf-button>
    <uf-button variant="secondary">Next<uf-icon slot="suffix" name="chevron-right"></uf-icon></uf-button>
    <uf-button variant="ghost" label="Search"><uf-icon slot="prefix" name="search"></uf-icon></uf-button>
  </div>`,
};

export const States: Story = {
  render: () => html`<div class="sb-row">
    <uf-button disabled>Disabled</uf-button>
    <uf-button loading>Saving</uf-button>
    <uf-button href="https://example.com" target="_blank" variant="outline">Link</uf-button>
  </div>`,
};

export const Customized: Story = {
  render: () => html`<div class="sb-row">
    <uf-button style="--uf-button-radius: 999px; --uf-button-bg: #0f766e; --uf-button-bg-hover: #115e59">
      Custom properties
    </uf-button>
  </div>`,
};
