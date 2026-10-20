import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Spinner',
  component: 'uf-spinner',
  args: { size: 'md', label: '' },
  render: (a) => html`<uf-spinner ${spread(a)}></uf-spinner>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`<div class="sb-row">
    <uf-spinner size="sm"></uf-spinner>
    <uf-spinner size="md"></uf-spinner>
    <uf-spinner size="lg"></uf-spinner>
    <uf-spinner style="--uf-spinner-size: 4rem"></uf-spinner>
  </div>`,
};

export const Label: Story = {
  name: 'Custom label',
  args: { label: "Loading John Smith's orders" },
};

export const InContext: Story = {
  name: 'In a card',
  render: () => html`<uf-card style="max-width: 20rem">
    <h3 slot="header" style="margin: 0">Orders</h3>
    <div style="display: grid; place-items: center; gap: 0.5rem; padding: 1rem 0">
      <uf-spinner size="lg" label="Loading orders"></uf-spinner>
      <span class="sb-note">Loading orders…</span>
    </div>
  </uf-card>`,
};

export const Customized: Story = {
  args: { size: 'lg', '--uf-spinner-indicator-color': '#0f766e', '--uf-spinner-track-color': 'transparent' },
};
