import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spread, storyArg } from '../.storybook/args';

const variants = ['neutral', 'accent', 'info', 'success', 'warning', 'danger'];
const appearances = ['soft', 'solid', 'outline'];

const meta: Meta = {
  title: 'Components/Badge',
  component: 'uf-badge',
  args: { text: 'Active', variant: 'success', appearance: 'soft', size: 'md', dot: false },
  argTypes: { text: storyArg('the badge text (default slot).') },
  render: (a) => html`<uf-badge ${spread(a)}>${a.text}</uf-badge>`,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  name: 'Variants and appearances',
  render: () => html`<div class="sb-stack" style="max-width: none">
    ${appearances.map(
      (appearance) => html`<div class="sb-row">
        <code style="width: 5rem">${appearance}</code>
        ${variants.map((variant) => html`<uf-badge variant=${variant} appearance=${appearance}>${variant}</uf-badge>`)}
      </div>`,
    )}
  </div>`,
};

export const Sizes: Story = {
  render: () => html`<div class="sb-row">
    <uf-badge size="sm" variant="accent">Small</uf-badge>
    <uf-badge size="md" variant="accent">Medium</uf-badge>
  </div>`,
};

export const WithDot: Story = {
  name: 'Status dot',
  render: () => html`<div class="sb-row">
    <uf-badge dot variant="success">Online</uf-badge>
    <uf-badge dot variant="warning">Away</uf-badge>
    <uf-badge dot variant="danger">Offline</uf-badge>
    <uf-badge dot appearance="outline">Unknown</uf-badge>
  </div>`,
};

export const WithIcon: Story = {
  name: 'With an icon',
  render: () => html`<div class="sb-row">
    <uf-badge variant="success"><uf-icon slot="prefix" name="check-circle"></uf-icon>Verified</uf-badge>
    <uf-badge variant="warning" appearance="solid"><uf-icon slot="prefix" name="alert-triangle"></uf-icon>Expiring</uf-badge>
    <uf-badge variant="info" appearance="outline"><uf-icon slot="prefix" name="info"></uf-icon>Beta</uf-badge>
  </div>`,
};

export const InContext: Story = {
  name: 'In context',
  render: () => html`<div class="sb-stack">
    <h3 style="margin: 0; display: flex; gap: 0.5rem; align-items: center">Release notes <uf-badge variant="accent" size="sm">New</uf-badge></h3>
    <uf-button variant="secondary">Inbox <uf-badge slot="suffix" appearance="solid" variant="danger" size="sm">3 unread</uf-badge></uf-button>
    <p class="sb-note" style="margin: 0">
      Badges are read as plain text: write "3 unread" rather than "3", so it makes sense on its own.
    </p>
  </div>`,
};

export const Customized: Story = {
  args: { text: 'Pill', variant: 'neutral', '--uf-badge-radius': '999px', '--uf-badge-bg': '#0f766e', '--uf-badge-color': '#ffffff' },
};
