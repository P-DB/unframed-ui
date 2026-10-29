import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread, storyArg } from '../.storybook/args';

const meta: Meta = {
  title: 'Components/Divider',
  component: 'uf-divider',
  args: { text: '', orientation: 'horizontal' },
  argTypes: { text: storyArg('an optional label (default slot), like "or".') },
  render: (a) => html`<div class="sb-stack"><span>Above</span><uf-divider ${spread(a)}>${a.text}</uf-divider><span>Below</span></div>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithLabel: Story = {
  name: 'With a label',
  args: { text: 'or' },
};

export const Vertical: Story = {
  render: () => html`<div style="display: flex; align-items: center; height: 1.5rem">
    <uf-button variant="link">Edit</uf-button>
    <uf-divider orientation="vertical"></uf-divider>
    <uf-button variant="link">Duplicate</uf-button>
    <uf-divider orientation="vertical"></uf-divider>
    <uf-button variant="link">Archive</uf-button>
  </div>`,
};

export const Customized: Story = {
  name: 'Custom properties',
  args: { text: 'Custom', '--uf-divider-color': '#6930c3', '--uf-divider-width': '2px', '--uf-divider-spacing': '2rem' },
};
