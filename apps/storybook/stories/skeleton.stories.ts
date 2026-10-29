import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Skeleton',
  component: 'uf-skeleton',
  args: { shape: 'text', lines: 3 },
  render: (a) => html`<div class="sb-stack" aria-busy="true"><uf-skeleton ${spread(a)}></uf-skeleton></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Shapes: Story = {
  render: () => html`<div class="sb-stack" aria-busy="true">
    <div style="display: flex; gap: 1rem; align-items: center">
      <uf-skeleton shape="circle"></uf-skeleton>
      <uf-skeleton lines="3" style="flex: 1"></uf-skeleton>
    </div>
    <uf-skeleton shape="rect"></uf-skeleton>
  </div>`,
};

export const LoadingCard: Story = {
  name: 'A card while it loads',
  render: () => html`<div style="max-width: 18rem">
    <uf-card aria-busy="true">
      <uf-skeleton slot="media" shape="rect" style="height: 8rem; --uf-skeleton-radius: 0"></uf-skeleton>
      <uf-skeleton slot="header" style="width: 60%"></uf-skeleton>
      <uf-skeleton lines="2"></uf-skeleton>
    </uf-card>
  </div>`,
};

export const Customized: Story = {
  name: 'Custom properties',
  args: { lines: 2, '--uf-skeleton-color': '#e5dbf6', '--uf-skeleton-highlight': '#cbb7ee', '--uf-skeleton-radius': '999px' },
};
